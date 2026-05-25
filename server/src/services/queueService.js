import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { logInfo, logWarning } from "../utils/logger.js";

const processors = new Map();
const queues = new Map();
const workers = new Map();
const memoryQueues = new Map();
let redisConnection;

function usesBullMq() {
  return env.queueDriver === "bullmq";
}

function getRedisConnection() {
  if (!redisConnection) {
    redisConnection = new IORedis(env.redisUrl, {
      maxRetriesPerRequest: null,
    });
  }

  return redisConnection;
}

function getBullQueue(queueName) {
  if (!queues.has(queueName)) {
    queues.set(
      queueName,
      new Queue(queueName, {
        connection: getRedisConnection(),
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            delay: 5000,
            type: "exponential",
          },
          removeOnComplete: 100,
          removeOnFail: 100,
        },
      }),
    );
  }

  return queues.get(queueName);
}

function getMemoryQueue(queueName) {
  if (!memoryQueues.has(queueName)) {
    memoryQueues.set(queueName, {
      active: false,
      jobs: [],
    });
  }

  return memoryQueues.get(queueName);
}

async function processMemoryQueue(queueName) {
  const queue = getMemoryQueue(queueName);

  if (queue.active) {
    return;
  }

  queue.active = true;

  while (queue.jobs.length > 0) {
    const job = queue.jobs.shift();
    const processor = processors.get(queueName);

    if (!processor) {
      logWarning("Queue job skipped because no processor is registered", {
        queueName,
      });
      continue;
    }

    try {
      await processor(job, {
        id: job.id,
        updateProgress(progress) {
          job.progress = progress;
          return Promise.resolve();
        },
      });
    } catch (error) {
      logWarning("In-memory queue job failed", {
        message: error.message,
        queueName,
      });
    }
  }

  queue.active = false;

  if (queue.jobs.length > 0) {
    setImmediate(() => {
      processMemoryQueue(queueName).catch((error) => {
        logWarning("In-memory queue processor crashed", {
          message: error.message,
          queueName,
        });
      });
    });
  }
}

function startBullWorker(queueName) {
  if (workers.has(queueName)) {
    return;
  }

  const processor = processors.get(queueName);

  if (!processor) {
    return;
  }

  const worker = new Worker(
    queueName,
    async (job) => processor(job.data, job),
    {
      concurrency: env.queueConcurrency,
      connection: getRedisConnection(),
    },
  );

  worker.on("failed", (job, error) => {
    logWarning("BullMQ job failed", {
      jobId: job?.id,
      message: error.message,
      queueName,
    });
  });

  workers.set(queueName, worker);
}

export function registerQueueProcessor(queueName, processor) {
  processors.set(queueName, processor);

  if (usesBullMq()) {
    startBullWorker(queueName);
  }

  logInfo("Queue processor registered", {
    driver: env.queueDriver,
    queueName,
  });
}

export async function enqueueJob(queueName, data, options = {}) {
  if (usesBullMq()) {
    const queue = getBullQueue(queueName);
    const { name, ...jobOptions } = options;
    const job = await queue.add(name ?? queueName, data, jobOptions);

    return {
      driver: "bullmq",
      id: job.id,
      queueName,
    };
  }

  const queue = getMemoryQueue(queueName);
  const job = {
    data,
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: options.name ?? queueName,
    progress: 0,
  };

  queue.jobs.push(job.data);
  setImmediate(() => {
    processMemoryQueue(queueName).catch((error) => {
      logWarning("In-memory queue processor crashed", {
        message: error.message,
        queueName,
      });
    });
  });

  return {
    driver: "memory",
    id: job.id,
    queueName,
  };
}

export async function closeQueues() {
  await Promise.all([
    ...Array.from(workers.values()).map((worker) => worker.close()),
    ...Array.from(queues.values()).map((queue) => queue.close()),
  ]);

  if (redisConnection) {
    await redisConnection.quit();
  }
}
