function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeName(name) {
  return String(name || "there").trim();
}

function buildBaseEmail({ body, ctaLabel, ctaUrl, eyebrow, title }) {
  const safeCtaUrl = escapeHtml(ctaUrl);

  return `
    <div style="margin:0;padding:0;background:#FEFCE8;color:#1C1917;font-family:Inter,Arial,sans-serif">
      <div style="max-width:640px;margin:0 auto;padding:32px 20px">
        <div style="border:1px solid #E7E5E4;border-radius:20px;background:#FFFFFF;padding:28px;box-shadow:0 18px 45px rgba(28,25,23,0.08)">
          <p style="margin:0 0 10px;color:#3F6212;font-size:12px;font-weight:800;letter-spacing:0.16em;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 0 14px;color:#1C1917;font-size:28px;line-height:1.15">${escapeHtml(title)}</h1>
          <div style="color:#57534E;font-size:15px;line-height:1.7">${body}</div>
          <a href="${safeCtaUrl}" style="display:inline-block;margin-top:22px;border-radius:999px;background:#3F6212;color:#FFFFFF;padding:13px 20px;font-weight:800;text-decoration:none">${escapeHtml(ctaLabel)}</a>
          <p style="margin:22px 0 0;color:#78716C;font-size:12px;line-height:1.65">If the button does not work, copy and paste this URL into your browser:<br /><span style="word-break:break-all">${safeCtaUrl}</span></p>
        </div>
        <p style="margin:18px 0 0;color:#78716C;font-size:12px;line-height:1.6;text-align:center">ScaleOps / ProofArena</p>
      </div>
    </div>
  `;
}

export function buildVerificationEmail({ expiresIn = "24 hours", name, verificationUrl }) {
  const safeName = normalizeName(name);
  const text = [
    `Hi ${safeName},`,
    "",
    "Verify your ProofArena email address to secure your outcome workspace:",
    verificationUrl,
    "",
    `This link expires in ${expiresIn}. If you did not create a ScaleOps / ProofArena account, ignore this email.`,
  ].join("\n");

  return {
    html: buildBaseEmail({
      body: `
        <p style="margin:0 0 14px">Hi ${escapeHtml(safeName)},</p>
        <p style="margin:0 0 14px">Verify your email address to secure your ProofArena account and keep your outcome workspace protected.</p>
        <p style="margin:0;color:#78716C">This verification link expires in ${escapeHtml(expiresIn)}. If you did not create a ScaleOps / ProofArena account, you can ignore this email.</p>
      `,
      ctaLabel: "Verify email",
      ctaUrl: verificationUrl,
      eyebrow: "Email verification",
      title: "Verify your ProofArena account",
    }),
    subject: "Verify your ProofArena account",
    text,
  };
}

export function buildPasswordResetEmail({ expiresIn = "30 minutes", name, resetUrl }) {
  const safeName = normalizeName(name);
  const text = [
    `Hi ${safeName},`,
    "",
    "Use this link to reset your ScaleOps password:",
    resetUrl,
    "",
    `This link expires in ${expiresIn}. If you did not request a password reset, ignore this email.`,
  ].join("\n");

  return {
    html: buildBaseEmail({
      body: `
        <p style="margin:0 0 14px">Hi ${escapeHtml(safeName)},</p>
        <p style="margin:0 0 14px">Use the secure link below to create a new ScaleOps password.</p>
        <p style="margin:0;color:#78716C">This reset link expires in ${escapeHtml(expiresIn)}. If you did not request it, ignore this email and your password will stay unchanged.</p>
      `,
      ctaLabel: "Reset password",
      ctaUrl: resetUrl,
      eyebrow: "Password reset",
      title: "Reset your ScaleOps password",
    }),
    subject: "Reset your ScaleOps password",
    text,
  };
}

export function buildLeadEmail(lead) {
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
      <div style="font-family:Inter,Arial,sans-serif;background:#FEFCE8;color:#1C1917;padding:24px">
        <div style="max-width:620px;margin:0 auto;border:1px solid #E7E5E4;border-radius:18px;padding:24px;background:#FFFFFF">
          <p style="margin:0 0 8px;color:#3F6212;font-size:12px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase">New lead inquiry</p>
          <h1 style="margin:0 0 20px;color:#1C1917;font-size:24px">A new prospect is ready for follow-up</h1>
          <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
          <p><strong>Service:</strong> ${escapeHtml(lead.service)}</p>
          <p><strong>Submitted:</strong> ${escapeHtml(createdAt)} UTC</p>
          <div style="margin-top:18px;padding:16px;border-radius:14px;background:#FFFBEB">
            <strong>Message</strong>
            <p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(lead.message)}</p>
          </div>
        </div>
      </div>
    `,
    text: lines.join("\n"),
  };
}

export function toBasicHtml(content) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#FEFCE8;color:#1C1917;padding:24px">
      <div style="max-width:640px;margin:0 auto;border:1px solid #E7E5E4;border-radius:18px;padding:24px;background:#FFFFFF;line-height:1.65">
        ${escapeHtml(content).replaceAll("\n", "<br />")}
      </div>
    </div>
  `;
}

