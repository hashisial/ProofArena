import { mkdir, writeFile } from "fs/promises";
import path from "path";

const outboxRoot = path.resolve(process.cwd(), "tmp", "email-outbox");

function safeFilePart(value) {
  return String(value ?? "email")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "email";
}

export async function writeDevelopmentEmail({ html, subject, text, to }) {
  await mkdir(outboxRoot, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const recipient = Array.isArray(to) ? to.join(",") : to;
  const baseName = `${timestamp}-${safeFilePart(subject)}-${safeFilePart(recipient)}`;
  const htmlPath = path.join(outboxRoot, `${baseName}.html`);
  const jsonPath = path.join(outboxRoot, `${baseName}.json`);

  await Promise.all([
    writeFile(htmlPath, html ?? "", "utf8"),
    writeFile(
      jsonPath,
      JSON.stringify(
        {
          createdAt: new Date().toISOString(),
          htmlPath,
          subject,
          text,
          to,
        },
        null,
        2,
      ),
      "utf8",
    ),
  ]);

  return {
    htmlPath,
    jsonPath,
  };
}
