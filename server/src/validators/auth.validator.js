import { z } from "zod";
import { PUBLIC_REGISTER_ROLE_VALUES } from "../constants/index.js";

const usernamePattern = /^[a-z0-9_-]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
const tokenPattern = /^[A-Za-z0-9._~+/=-]+$/;

const requiredString = (message) =>
  z
    .string({ error: message })
    .trim()
    .min(1, message);

const emailSchema = requiredString("Email is required.")
  .email("Please enter a valid email address.")
  .toLowerCase();

const strongPasswordSchema = z
  .string({ error: "Password is required." })
  .min(8, "Password must be at least 8 characters.")
  .max(128, "Password must be 128 characters or fewer.")
  .regex(passwordPattern, "Password must include uppercase, lowercase, and a number.");

const authTokenSchema = requiredString("Token is required.")
  .min(20, "Token is invalid.")
  .max(512, "Token is invalid.")
  .regex(tokenPattern, "Token is invalid.");

const emptyBodySchema = z.object({}).strict();

export const registerSchema = z
  .object({
    accountType: z.enum(["individual", "agency"], {
      error: "Account type must be individual or agency.",
    }).optional(),
    email: emailSchema,
    fullName: requiredString("Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must be 80 characters or fewer.")
      .optional(),
    // Backward compatibility for the current ScaleOps client form. The request is
    // normalized to fullName below so controllers/services can use one field.
    name: requiredString("Full name is required.")
      .min(2, "Full name must be at least 2 characters.")
      .max(80, "Full name must be 80 characters or fewer.")
      .optional(),
    password: strongPasswordSchema,
    role: z.enum(PUBLIC_REGISTER_ROLE_VALUES, {
      error: "Admin accounts cannot be created through public registration.",
    }),
    username: requiredString("Username is required.")
      .toLowerCase()
      .min(3, "Username must be 3-30 characters.")
      .max(30, "Username must be 3-30 characters.")
      .regex(usernamePattern, "Username can only contain letters, numbers, underscores, and hyphens."),
  })
  .strict()
  .refine((value) => value.role !== "admin", {
    message: "Admin accounts cannot be created through public registration.",
    path: ["role"],
  })
  .refine((value) => Boolean(value.fullName || value.name), {
    message: "Full name is required.",
    path: ["fullName"],
  })
  .transform((value) => ({
    ...value,
    fullName: value.fullName || value.name,
    name: value.name || value.fullName,
  }));

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string({ error: "Password is required." }).min(1, "Password is required."),
  })
  .strict();

export const logoutSchema = emptyBodySchema;

export const refreshTokenSchema = emptyBodySchema;

export const forgotPasswordSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    confirmPassword: z.string({ error: "Please confirm your password." }).min(1, "Please confirm your password."),
    password: strongPasswordSchema,
    token: authTokenSchema,
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z
  .object({
    token: authTokenSchema,
  })
  .strict();

export const resendVerificationSchema = z
  .object({
    email: emailSchema,
  })
  .strict();

export const verifyEmailParamsSchema = z
  .object({
    token: authTokenSchema,
  })
  .strict();

export const changePasswordSchema = z
  .object({
    confirmNewPassword: z
      .string({ error: "Please confirm your new password." })
      .min(1, "Please confirm your new password."),
    currentPassword: z.string({ error: "Current password is required." }).min(1, "Current password is required."),
    newPassword: strongPasswordSchema,
  })
  .strict()
  .refine((value) => value.newPassword === value.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });

export const updatePasswordSchema = changePasswordSchema;

export const authSchemas = Object.freeze({
  changePassword: changePasswordSchema,
  forgotPassword: forgotPasswordSchema,
  login: loginSchema,
  logout: logoutSchema,
  refreshToken: refreshTokenSchema,
  register: registerSchema,
  resetPassword: resetPasswordSchema,
  resendVerification: resendVerificationSchema,
  updatePassword: updatePasswordSchema,
  verifyEmail: verifyEmailSchema,
  verifyEmailParams: verifyEmailParamsSchema,
});
