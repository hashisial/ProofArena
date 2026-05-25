export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email ?? "").trim());
}

export function isStrongPassword(password) {
  const value = String(password ?? "");

  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value)
  );
}

export function isValidUsername(username) {
  return /^[a-zA-Z0-9_-]{3,30}$/.test(String(username ?? "").trim());
}

export function getPasswordStrengthError(password) {
  const value = String(password ?? "");

  if (!value) {
    return "Password is required.";
  }

  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/\d/.test(value)) {
    return "Password must include uppercase, lowercase, and a number.";
  }

  return "";
}

export function isValidUrl(url) {
  const value = String(url ?? "").trim();

  if (!value) {
    return false;
  }

  try {
    const parsedUrl = new URL(value);
    return ["http:", "https:"].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

export function isRequired(value) {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value !== null && value !== undefined;
}
