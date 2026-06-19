import nodemailer from "nodemailer";
import { env } from "../../config/env.js";
import { logInfo, logWarning } from "../../utils/logger.js";
import {
  buildLeadEmail,
  buildPasswordResetEmail,
  buildVerificationEmail,
  toBasicHtml,
} from "./email.templates.js";

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

export async function sendEmail({ html, replyTo, subject, text, to }) {
  const mailer = getTransporter();

  if (!mailer) {
    logInfo("Email skipped because SMTP is not configured", { subject });
    return { skipped: true };
  }

  if (!hasRecipient(to)) {
    logWarning("Email skipped because recipient is missing", { subject });
    return { skipped: true };
  }

  try {
    await mailer.sendMail({
      from: env.emailFrom,
      html,
      replyTo,
      subject,
      text,
      to,
    });

    return { sent: true };
  } catch (error) {
    logWarning("Email delivery failed", {
      message: error.message,
      subject,
    });

    return { failed: true, skipped: true };
  }
}

export async function sendVerificationEmail({ email, name, verificationUrl }) {
  const template = buildVerificationEmail({
    expiresIn: "24 hours",
    name,
    verificationUrl,
  });

  return sendEmail({
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

