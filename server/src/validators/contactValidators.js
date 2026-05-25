import { body } from "express-validator";

export const contactValidationRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Enter a valid email address")
    .normalizeEmail(),
  body("service").trim().notEmpty().withMessage("Service is required"),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .bail()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Message must be between 10 and 2000 characters"),
];
