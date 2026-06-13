const SENSITIVE_MODEL_FIELDS = Object.freeze([
  "__v",
  "adminNotes",
  "emailVerificationToken",
  "emailVerificationExpires",
  "internalNotes",
  "password",
  "passwordResetExpires",
  "passwordResetToken",
  "refreshToken",
  "refreshTokenExpiresAt",
  "refreshTokenHash",
  "refreshTokenVersion",
  "twoFactorSecret",
]);

export function cleanSensitiveFields(ret = {}) {
  SENSITIVE_MODEL_FIELDS.forEach((field) => {
    delete ret[field];
  });

  return ret;
}

function normalizeModelOutput(ret = {}) {
  if (ret._id && !ret.id) {
    ret.id = ret._id.toString();
  }

  cleanSensitiveFields(ret);
  return ret;
}

function createTransform(existingTransform) {
  return (document, ret, options) => {
    const transformed = existingTransform
      ? existingTransform(document, ret, options) || ret
      : ret;

    return normalizeModelOutput(transformed);
  };
}

export const baseSchemaOptions = Object.freeze({
  timestamps: true,
  toJSON: {
    transform: createTransform(),
    virtuals: true,
  },
  toObject: {
    transform: createTransform(),
    virtuals: true,
  },
});

export function applyBaseSchemaConfig(schema) {
  const existingToJSON = schema.get("toJSON") || {};
  const existingToObject = schema.get("toObject") || {};

  schema.set("timestamps", true);
  schema.set("toJSON", {
    ...existingToJSON,
    transform: createTransform(existingToJSON.transform),
    virtuals: existingToJSON.virtuals ?? true,
  });
  schema.set("toObject", {
    ...existingToObject,
    transform: createTransform(existingToObject.transform),
    virtuals: existingToObject.virtuals ?? true,
  });

  return schema;
}
