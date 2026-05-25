import { io } from "socket.io-client";
import { getRealtimeBaseUrl } from "./apiClient.js";

function isVercelServerlessUrl(url) {
  try {
    return new URL(url).hostname.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

export function createMessagingSocket(token) {
  const realtimeBaseUrl = getRealtimeBaseUrl();

  if (!import.meta.env.VITE_REALTIME_URL && isVercelServerlessUrl(realtimeBaseUrl)) {
    return null;
  }

  return io(realtimeBaseUrl, {
    auth: { token },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 8,
    reconnectionDelay: 500,
    transports: ["websocket", "polling"],
  });
}
