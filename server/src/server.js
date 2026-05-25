const { app } = await import("./app.js");
const { connectDB } = await import("./config/db.js");
const { env } = await import("./config/env.js");
const { closeQueues } = await import("./services/queueService.js");
const { closeSocketServer, initializeSocketServer } = await import("./socket/index.js");
const { logger } = await import("./utils/logger.js");

let server;
let shuttingDown = false;

async function shutdown(signal, exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  logger.info(`${signal} received. Closing server.`);
  closeSocketServer();

  const closeResources = async () => {
    await closeQueues();
    process.exit(exitCode);
  };

  if (!server) {
    await closeResources();
    return;
  }

  server.close(closeResources);
}

async function startServer() {
  try {
    await connectDB();
    await import("./workers/index.js");

    server = app.listen(env.port, () => {
      logger.info("Server started", {
        environment: env.nodeEnv,
        port: env.port,
        product: "ProofArena by ScaleOps",
      });
    });

    initializeSocketServer(server);
  } catch (error) {
    logger.error("Server startup failed", { message: error.message });
    process.exit(1);
  }
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", {
    message: reason instanceof Error ? reason.message : String(reason),
  });
  shutdown("unhandledRejection", 1);
});
process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { message: error.message });
  shutdown("uncaughtException", 1);
});

await startServer();
