export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  CLIENT: "client",
  PROVIDER: "provider",
  USER: "user",
});

// "user" is a supported legacy alias that normalizes to "client". It is not
// stored as a distinct account role.
export const USER_ROLE_VALUES = Object.freeze([
  USER_ROLES.ADMIN,
  USER_ROLES.CLIENT,
  USER_ROLES.PROVIDER,
]);

export const PUBLIC_REGISTER_ROLE_VALUES = Object.freeze([
  USER_ROLES.CLIENT,
  USER_ROLES.PROVIDER,
]);
