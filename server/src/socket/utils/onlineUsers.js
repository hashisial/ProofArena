const onlineUsers = new Map();

export function markUserOnline(userId) {
  const key = String(userId ?? "");

  if (!key) {
    return false;
  }

  const current = onlineUsers.get(key) ?? 0;
  onlineUsers.set(key, current + 1);

  return current === 0;
}

export function markUserOffline(userId) {
  const key = String(userId ?? "");
  const current = onlineUsers.get(key) ?? 0;

  if (current <= 1) {
    onlineUsers.delete(key);
    return true;
  }

  onlineUsers.set(key, current - 1);
  return false;
}

export function isUserOnline(userId) {
  return onlineUsers.has(String(userId ?? ""));
}

export function getOnlineStatuses(userIds = []) {
  return Array.from(new Set(userIds.map((userId) => String(userId ?? "")).filter(Boolean)))
    .map((userId) => ({
      online: isUserOnline(userId),
      userId,
    }));
}

export function clearOnlineUsers() {
  onlineUsers.clear();
}
