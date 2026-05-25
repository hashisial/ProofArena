import Stripe from "stripe";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export const stripeApiVersion = "2026-02-25.clover";

let stripeClient;

export function getStripe() {
  if (!env.stripeSecretKey) {
    throw new AppError("Stripe is not configured", 503);
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.stripeSecretKey, {
      apiVersion: stripeApiVersion,
    });
  }

  return stripeClient;
}

export function assertStripeBillingConfigured() {
  if (!env.stripeBillingEnabled) {
    throw new AppError("Stripe billing is not configured", 503);
  }

  return getStripe();
}

export function assertStripeMarketplaceConfigured() {
  if (!env.stripeMarketplaceEnabled) {
    throw new AppError("Stripe marketplace payments are not configured", 503);
  }

  return getStripe();
}
