import mongoose from "mongoose";
import { env } from "./env.js";
import { ProviderProfile } from "../models/ProviderProfile.js";
import { logger } from "../utils/logger.js";

const providerProfileArrayFields = new Set(["categories", "languages", "skills"]);

function hasMultipleProviderArrayFields(index) {
  const indexedFields = Object.keys(index.key ?? {});
  const arrayFieldCount = indexedFields.filter((field) =>
    providerProfileArrayFields.has(field),
  ).length;

  return arrayFieldCount > 1;
}

function hasOutdatedProviderTextIndex(index) {
  if (index.key?._fts !== "text") {
    return false;
  }

  const weightedFields = Object.keys(index.weights ?? {}).sort();

  return weightedFields.length !== 1 || weightedFields[0] !== "title";
}

async function repairProviderProfileIndexes() {
  try {
    const indexes = await ProviderProfile.collection.indexes();
    const indexesToDrop = indexes.filter(
      (index) =>
        index.name !== "_id_" &&
        (hasMultipleProviderArrayFields(index) || hasOutdatedProviderTextIndex(index)),
    );

    for (const index of indexesToDrop) {
      await ProviderProfile.collection.dropIndex(index.name);
      logger.info("Dropped outdated provider profile index", { indexName: index.name });
    }

    await ProviderProfile.collection.createIndex(
      { title: "text" },
      {
        background: true,
        name: "provider_profile_text",
        weights: { title: 10 },
      },
    );
  } catch (error) {
    logger.warn("Provider profile index repair skipped", { message: error.message });
  }
}

export async function connectDB() {
  if (!env.mongoUri) {
    logger.warn("MONGO_URI is not set. MongoDB connection skipped.");
    return null;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    return mongoose.connection.asPromise();
  }

  try {
    const connection = await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    logger.info("MongoDB connected", { host: connection.connection.host });
    await repairProviderProfileIndexes();
    return connection;
  } catch (error) {
    logger.error("MongoDB connection error", { message: error.message });

    if (env.isProduction) {
      process.exit(1);
    }

    logger.warn("Continuing without MongoDB in development. Public pages can use fallback data.");
    return null;
  }
}
