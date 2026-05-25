export const clientMessageEvents = Object.freeze({
  MESSAGE_READ: "message:read",
  MESSAGE_SEND: "message:send",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
});

export const serverMessageEvents = Object.freeze({
  CONVERSATION_UPDATE: "conversation:update",
  MESSAGE_READ: "message:read",
  MESSAGE_RECEIVE: "message:receive",
  TYPING_START: "typing:start",
  TYPING_STOP: "typing:stop",
  USER_OFFLINE: "user:offline",
  USER_ONLINE: "user:online",
});
