import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const requestedScopes = new Set(process.argv.slice(2));
const scopes = requestedScopes.size
  ? requestedScopes
  : new Set(["client", "server"]);
const supportedScopes = new Set(["client", "server"]);

for (const scope of scopes) {
  if (!supportedScopes.has(scope)) {
    console.error(`Unknown boundary-check scope: ${scope}`);
    process.exit(1);
  }
}

const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".cjs"]);
const ignoredDirectories = new Set(["dist", "node_modules"]);
const violations = [];
const warnings = [];

function normalize(filePath) {
  return path.resolve(filePath).replaceAll("\\", "/");
}

function isInside(filePath, directoryPath) {
  const file = normalize(filePath);
  const directory = normalize(directoryPath);
  return file === directory || file.startsWith(`${directory}/`);
}

function relativeToRepository(filePath) {
  return path.relative(repositoryRoot, filePath).replaceAll("\\", "/");
}

async function collectSourceFiles(directoryPath) {
  const files = [];

  async function visit(currentPath) {
    const entries = await readdir(currentPath, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoredDirectories.has(entry.name)) continue;

      const entryPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        await visit(entryPath);
      } else if (sourceExtensions.has(path.extname(entry.name))) {
        files.push(entryPath);
      }
    }
  }

  await visit(directoryPath);
  return files;
}

function extractImports(source) {
  const imports = new Set();
  const patterns = [
    /\b(?:import|export)\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
    /\bimport\(\s*["']([^"']+)["']\s*\)/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) imports.add(match[1]);
  }

  return [...imports];
}

function resolveClientImport(sourcePath, specifier) {
  const clientSource = path.join(repositoryRoot, "client", "src");

  if (specifier === "@") return clientSource;
  if (specifier.startsWith("@/")) {
    return path.join(clientSource, specifier.slice(2));
  }
  if (specifier === "@proofarena") {
    return path.join(clientSource, "modules", "proofarena", "index.js");
  }
  if (specifier.startsWith("@proofarena/")) {
    return path.join(
      clientSource,
      "modules",
      "proofarena",
      specifier.slice("@proofarena/".length),
    );
  }

  return specifier.startsWith(".")
    ? path.resolve(path.dirname(sourcePath), specifier)
    : null;
}

function resolveServerImport(sourcePath, specifier) {
  return specifier.startsWith(".")
    ? path.resolve(path.dirname(sourcePath), specifier)
    : null;
}

function reportViolation(sourcePath, specifier, reason) {
  violations.push(
    `${relativeToRepository(sourcePath)} -> ${specifier}\n  ${reason}`,
  );
}

function reportWarning(sourcePath, specifier, reason) {
  warnings.push(
    `${relativeToRepository(sourcePath)} -> ${specifier}\n  ${reason}`,
  );
}

function checkClientImport(sourcePath, specifier, targetPath) {
  if (!targetPath) return;

  const sourceRoot = path.join(repositoryRoot, "client", "src");
  const componentsRoot = path.join(sourceRoot, "components");
  const commonComponentsRoot = path.join(componentsRoot, "common");
  const uiComponentsRoot = path.join(componentsRoot, "ui");
  const featuresRoot = path.join(sourceRoot, "features");
  const modulesRoot = path.join(sourceRoot, "modules");
  const proofArenaRoot = path.join(modulesRoot, "proofarena");
  const proofArenaPublicApi = path.join(proofArenaRoot, "index.js");
  const protectedGlobalRoots = [
    uiComponentsRoot,
    path.join(sourceRoot, "config"),
    path.join(sourceRoot, "constants"),
    path.join(sourceRoot, "errors"),
    path.join(sourceRoot, "lib"),
    path.join(sourceRoot, "store"),
    path.join(sourceRoot, "utils"),
  ];

  const sourceIsProtectedGlobal = protectedGlobalRoots.some((root) =>
    isInside(sourcePath, root),
  );

  if (
    sourceIsProtectedGlobal &&
    (isInside(targetPath, featuresRoot) ||
      isInside(targetPath, modulesRoot) ||
      isInside(targetPath, path.join(sourceRoot, "pages")) ||
      isInside(targetPath, path.join(sourceRoot, "routes")))
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Shared/global foundations cannot depend on feature, module, page, or route implementations.",
    );
  }

  if (
    sourceIsProtectedGlobal &&
    isInside(targetPath, componentsRoot) &&
    !isInside(targetPath, uiComponentsRoot) &&
    !isInside(targetPath, commonComponentsRoot)
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Shared/global foundations cannot depend on domain-owned components.",
    );
  }

  if (
    !isInside(sourcePath, proofArenaRoot) &&
    isInside(targetPath, proofArenaRoot) &&
    normalize(targetPath) !== normalize(proofArenaPublicApi)
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Code outside ProofArena must import its public entry point, not private module files.",
    );
  }

  if (
    isInside(sourcePath, featuresRoot) &&
    isInside(targetPath, proofArenaRoot)
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Domain features cannot depend on the product-composition module.",
    );
  }

  if (isInside(sourcePath, modulesRoot) && isInside(targetPath, modulesRoot)) {
    const sourceModule = relativeToRepository(sourcePath).split("/")[3];
    const targetModule = relativeToRepository(targetPath).split("/")[3];
    const targetIsPublicApi = path.basename(targetPath) === "index.js";

    if (sourceModule !== targetModule && !targetIsPublicApi) {
      reportViolation(
        sourcePath,
        specifier,
        "Modules may consume another module only through that module's public index.",
      );
    }
  }
}

function checkServerImport(sourcePath, specifier, targetPath) {
  const sourceRoot = path.join(repositoryRoot, "server", "src");
  const modulesRoot = path.join(sourceRoot, "modules");
  const modelsRoot = path.join(sourceRoot, "models");
  const servicesRoot = path.join(sourceRoot, "services");
  const controllersRoot = path.join(sourceRoot, "controllers");
  const routesRoot = path.join(sourceRoot, "routes");
  const sharedRoots = ["config", "constants", "errors", "middleware", "utils"].map(
    (directory) => path.join(sourceRoot, directory),
  );

  if (
    specifier.includes("client/src") ||
    specifier.includes("client\\src")
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Backend code cannot import frontend code.",
    );
    return;
  }

  if (!targetPath) return;

  if (
    isInside(sourcePath, modelsRoot) &&
    (isInside(targetPath, controllersRoot) ||
      isInside(targetPath, routesRoot) ||
      isInside(targetPath, servicesRoot))
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Models cannot depend on services, controllers, or routes.",
    );
  }

  if (
    isInside(sourcePath, servicesRoot) &&
    (isInside(targetPath, controllersRoot) || isInside(targetPath, routesRoot))
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Services cannot depend on HTTP controllers or routes.",
    );
  }

  if (
    sharedRoots.some((root) => isInside(sourcePath, root)) &&
    isInside(targetPath, modulesRoot)
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Shared backend infrastructure cannot depend on a product module.",
    );
  }

  if (
    !isInside(sourcePath, modulesRoot) &&
    isInside(targetPath, modulesRoot) &&
    path.basename(targetPath) !== "index.js"
  ) {
    reportViolation(
      sourcePath,
      specifier,
      "Code outside a backend module must import its public index, not private module files.",
    );
  }

  if (
    isInside(sourcePath, controllersRoot) &&
    isInside(targetPath, modelsRoot)
  ) {
    reportWarning(
      sourcePath,
      specifier,
      "Controller imports a model directly. Move business/data access into a service during a tested vertical migration.",
    );
  }

  if (isInside(sourcePath, modulesRoot) && isInside(targetPath, modulesRoot)) {
    const sourceModule = relativeToRepository(sourcePath).split("/")[3];
    const targetModule = relativeToRepository(targetPath).split("/")[3];
    const targetIsPublicApi = path.basename(targetPath) === "index.js";

    if (sourceModule !== targetModule && !targetIsPublicApi) {
      reportViolation(
        sourcePath,
        specifier,
        "Backend modules may consume another module only through its public index.",
      );
    }
  }
}

async function checkScope(scope) {
  const sourceRoot = path.join(repositoryRoot, scope, "src");
  const files = await collectSourceFiles(sourceRoot);

  for (const filePath of files) {
    const source = await readFile(filePath, "utf8");
    for (const specifier of extractImports(source)) {
      const targetPath =
        scope === "client"
          ? resolveClientImport(filePath, specifier)
          : resolveServerImport(filePath, specifier);

      if (scope === "client") {
        checkClientImport(filePath, specifier, targetPath);
      } else {
        checkServerImport(filePath, specifier, targetPath);
      }
    }
  }
}

for (const scope of scopes) await checkScope(scope);

if (warnings.length) {
  console.warn(`Module boundary warnings (${warnings.length}):`);
  console.warn(warnings.join("\n"));
}

if (violations.length) {
  console.error(`Module boundary violations (${violations.length}):`);
  console.error(violations.join("\n"));
  process.exit(1);
}

console.log(
  `Module boundary check passed for: ${[...scopes].join(", ")}.`,
);
