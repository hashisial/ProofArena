import dotenv from "dotenv";

const baseConfig = dotenv.config({ quiet: true });
const nodeEnv = process.env.NODE_ENV ?? "development";

dotenv.config({
  path: `.env.${nodeEnv}`,
  override: false,
  quiet: true,
});

if (baseConfig.error && nodeEnv === "development") {
  console.warn(".env file not found. Using process environment values.");
}
