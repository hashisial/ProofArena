import nodemailer from "nodemailer";
import { env } from "../config/env.js";
import { logInfo, logWarning } from "../utils/logger.js";

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

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildLeadEmail(lead) {
  const createdAt = lead.createdAt
    ? new Date(lead.createdAt).toLocaleString("en-US", { timeZone: "UTC" })
    : new Date().toLocaleString("en-US", { timeZone: "UTC" });

  const lines = [
    "New lead inquiry",
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Service: ${lead.service}`,
    `Submitted: ${createdAt} UTC`,
    "",
    "Message:",
    lead.message,
  ];

  return {
    html: `
      <div style="font-family:Inter,Arial,sans-serif;background:#020617;color:#e2e8f0;padding:24px">
        <div style="max-width:620px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:18px;padding:24px;background:rgba(15,23,42,0.92)">
          <p style="margin:0 0 8px;color:#67e8f9;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase">New lead inquiry</p>
          <h1 style="margin:0 0 20px;color:#ffffff;font-size:24px">A new prospect is ready for follow-up</h1>
          <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
          <p><strong>Service:</strong> ${escapeHtml(lead.service)}</p>
          <p><strong>Submitted:</strong> ${escapeHtml(createdAt)} UTC</p>
          <div style="margin-top:18px;padding:16px;border-radius:14px;background:rgba(255,255,255,0.06)">
            <strong>Message</strong>
            <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(lead.message)}</p>
          </div>
        </div>
      </div>
    `,
    text: lines.join("\n"),
  };
}

export async function sendLeadNotification(lead) {
  const mailer = getTransporter();

  if (!mailer) {
    logInfo("Lead notification email skipped because email is not configured");
    return { skipped: true };
  }

  try {
    const email = buildLeadEmail(lead);

    await mailer.sendMail({
      from: env.emailFrom,
      html: email.html,
      replyTo: lead.email,
      subject: `New lead: ${lead.name} - ${lead.service}`,
      text: email.text,
      to: env.leadNotificationEmail,
    });

    return { sent: true };
  } catch (error) {
    logWarning("Lead notification email failed", {
      leadId: lead?._id?.toString(),
      message: error.message,
    });

    return { failed: true };
  }
}

export async function sendPasswordResetEmail({ email, name, resetUrl }) {
  const mailer = getTransporter();

  if (!mailer) {
    logInfo("Password reset email skipped because email is not configured", {
      email,
    });
    return { skipped: true };
  }

  const safeName = name || "there";
  const text = [
    `Hi ${safeName},`,
    "",
    "Use this link to reset your ScaleOps password:",
    resetUrl,
    "",
    "This link expires in 1 hour. If you did not request it, ignore this email.",
  ].join("\n");

  try {
    await mailer.sendMail({
      from: env.emailFrom,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#faf5ff;color:#111827;padding:24px">
          <div style="max-width:620px;margin:0 auto;border:1px solid rgba(124,58,237,0.22);border-radius:22px;padding:24px;background:#ffffff">
            <p style="margin:0 0 8px;color:#7C3AED;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase">Password reset</p>
            <h1 style="margin:0 0 14px;color:#050505;font-size:26px;line-height:1.1">Reset your ScaleOps password</h1>
            <p style="color:rgba(5,5,5,0.66);line-height:1.65">Hi ${escapeHtml(safeName)}, use the button below to create a new password. This link expires in 1 hour.</p>
            <a href="${escapeHtml(resetUrl)}" style="display:inline-block;margin-top:16px;border-radius:999px;background:#7C3AED;color:#ffffff;padding:13px 20px;font-weight:800;text-decoration:none">Reset password</a>
            <p style="margin-top:18px;color:rgba(5,5,5,0.48);font-size:12px;line-height:1.6">If the button does not work, open this URL: ${escapeHtml(resetUrl)}</p>
          </div>
        </div>
      `,
      subject: "Reset your ScaleOps password",
      text,
      to: email,
    });

    return { sent: true };
  } catch (error) {
    logWarning("Password reset email failed", {
      email,
      message: error.message,
    });

    return { failed: true, skipped: true };
  }
}

export async function sendEmailVerificationEmail({ email, name, verificationUrl }) {
  const mailer = getTransporter();

  if (!mailer) {
    logInfo("Email verification email skipped because email is not configured", {
      email,
    });
    return { skipped: true };
  }

  const safeName = name || "there";
  const text = [
    `Hi ${safeName},`,
    "",
    "Use this link to verify your ProofArena account:",
    verificationUrl,
    "",
    "This link expires in 24 hours. If you did not request it, ignore this email.",
  ].join("\n");

  try {
    await mailer.sendMail({
      from: env.emailFrom,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;background:#faf5ff;color:#111827;padding:24px">
          <div style="max-width:620px;margin:0 auto;border:1px solid rgba(124,58,237,0.22);border-radius:22px;padding:24px;background:#ffffff">
            <p style="margin:0 0 8px;color:#7C3AED;font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase">Email verification</p>
            <h1 style="margin:0 0 14px;color:#050505;font-size:26px;line-height:1.1">Verify your ProofArena account</h1>
            <p style="color:rgba(5,5,5,0.66);line-height:1.65">Hi ${escapeHtml(safeName)}, verify your email to secure your outcome workspace. This link expires in 24 hours.</p>
            <a href="${escapeHtml(verificationUrl)}" style="display:inline-block;margin-top:16px;border-radius:999px;background:#7C3AED;color:#ffffff;padding:13px 20px;font-weight:800;text-decoration:none">Verify email</a>
            <p style="margin-top:18px;color:rgba(5,5,5,0.48);font-size:12px;line-height:1.6">If the button does not work, open this URL: ${escapeHtml(verificationUrl)}</p>
          </div>
        </div>
      `,
      subject: "Verify your ProofArena account",
      text,
      to: email,
    });

    return { sent: true };
  } catch (error) {
    logWarning("Email verification email failed", {
      email,
      message: error.message,
    });

    return { failed: true, skipped: true };
  }
}

export async function sendOutboundEmail({ html, replyTo, subject, text, to }) {
  const mailer = getTransporter();

  if (!mailer) {
    logInfo("Outbound email skipped because email is not configured", {
      subject,
      to,
    });
    return { skipped: true };
  }

  await mailer.sendMail({
    from: env.emailFrom,
    html,
    replyTo,
    subject,
    text,
    to,
  });

  return { sent: true };
}

export function toBasicHtml(content) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#020617;color:#e2e8f0;padding:24px">
      <div style="max-width:640px;margin:0 auto;border:1px solid rgba(255,255,255,0.12);border-radius:18px;padding:24px;background:rgba(15,23,42,0.92);line-height:1.65">
        ${escapeHtml(content).replaceAll("\n", "<br />")}
      </div>
    </div>
  `;
}
