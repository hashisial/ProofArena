export function getOwnerFilter(userId) {
  return { userId: userId ?? null };
}

export function getOptionalOwnerFilter(userId) {
  return userId ? { userId } : {};
}
