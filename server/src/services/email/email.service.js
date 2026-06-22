import nodemailer from "nodemailer";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/AppError.js";
import { logInfo, logWarning } from "../../utils/logger.js";
import {
  buildLeadEmail,
  buildPasswordResetEmail,
  buildVerificationEmail,
  toBasicHtml,
} from "./email.templates.js";
import { writeDevelopmentEmail } from "./devEmailOutbox.js";

let transporter;

function getTransporter() {
  if (!env.emailEnabled) {
    return null;
  }

  if (transporter) {
    return transporter;
  }

  transporter = nodemailer.createTransport({
    auth:
      env.smtpUser && env.smtpPass
        ? {
            pass: env.smtpPass,
            user: env.smtpUser,
          }
        : undefined,
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
  });

  return transporter;
}

function hasRecipient(to) {
  return Array.isArray(to) ? to.length > 0 : Boolean(String(to ?? "").trim());
}

function isDevelopmentEmailFallbackEnabled() {
  return !env.isProduction && !env.emailEnabled;
}

export async function sendEmail({
  developmentPreviewUrl,
  html,
  replyTo,
  subject,
  text,
  to,
}) {
  const mailer = getTransporter();

  if (!mailer) {
    if (!isDevelopmentEmailFallbackEnabled()) {
      throw new AppError(
        "Email delivery is not configured.",
        503,
        [{ field: "email", message: "Configure EMAIL_HOST and EMAIL_FROM on the server." }],
        "EMAIL_NOT_CONFIGURED",
      );
    }

    const outbox = await writeDevelopmentEmail({
      html,
      subject,
      text,
      to,
    });

    logInfo("Development email written to local outbox because SMTP is not configured", {
      htmlPath: outbox.htmlPath,
      subject,
    });

    return {
      developmentOutboxPath: outbox.htmlPath,
      developmentPreviewUrl,
      sent: false,
      skipped: true,
    };
  }

  if (!hasRecipient(to)) {
    logWarning("Email skipped because recipient is missing", { subject });
    return { skipped: true };
  }

  try {
    const delivery = await mailer.sendMail({
      from: env.emailFrom,
      html,
      replyTo,
      subject,
      text,
      to,
    });

    return { messageId: delivery?.messageId, sent: true };
  } catch (error) {
    logWarning("Email delivery failed", {
      message: error.message,
      subject,
    });

    throw new AppError(
      "Email delivery failed. Please try again.",
      502,
      [{ field: "email", message: "The email provider rejected the message." }],
      "EMAIL_DELIVERY_FAILED",
    );
  }
}

export async function sendVerificationEmail({ email, name, verificationUrl }) {
  const template = buildVerificationEmail({
    expiresIn: "24 hours",
    name,
    verificationUrl,
  });

  return sendEmail({
    developmentPreviewUrl: verificationUrl,
    html: template.html,
    subject: template.subject,
    text: template.text,
    to: email,
  });
}

export async function sendPasswordResetEmail({ email, name, resetUrl }) {
  const template = buildPasswordResetEmail({
    expiresIn: "30 minutes",
    name,
    resetUrl,
  });

  return sendEmail({
    developmentPreviewUrl: resetUrl,
    html: template.html,
    subject: template.subject,
    text: template.text,
    to: email,
  });
}

export async function sendLeadNotification(lead) {
  if (!env.leadNotificationEmail) {
    logInfo("Lead notification email skipped because no lead recipient is configured");
    return { skipped: true };
  }

  const template = buildLeadEmail(lead);

  return sendEmail({
    html: template.html,
    replyTo: lead.email,
    subject: `New lead: ${lead.name} - ${lead.service}`,
    text: template.text,
    to: env.leadNotificationEmail,
  });
}

export async function sendOutboundEmail({ html, replyTo, subject, text, to }) {
  return sendEmail({
    html,
    replyTo,
    subject,
    text,
    to,
  });
}

export const sendEmailVerificationEmail = sendVerificationEmail;
export { toBasicHtml };
