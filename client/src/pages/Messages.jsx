import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys.js";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  blockUser,
  deleteConversationMessage,
  getConversationMessages,
  getConversations,
  getPresence,
  markConversationRead,
  sendConversationMessage,
  startAdminConversation,
  startConversation,
  uploadMessageAttachments,
} from "../services/api.js";
import { createMessagingSocket } from "../services/messagingSocket.js";
import { getInitials } from "../utils/index.js";

const conversationQueryKey = queryKeys.messages.conversations();

function formatTime(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function getParticipantName(participant) {
  return participant?.fullName || participant?.name || participant?.email || "User";
}

function getOtherParticipants(conversation, userId) {
  return (conversation?.participants ?? []).filter(
    (participant) => participant.id !== userId,
  );
}

function upsertConversation(conversations = [], conversation) {
  const next = [
    conversation,
    ...conversations.filter((item) => item._id !== conversation._id),
  ];

  return next.sort((a, b) => new Date(b.updatedAt ?? 0) - new Date(a.updatedAt ?? 0));
}

function upsertMessage(messages = [], message) {
  if (messages.some((item) => item._id === message._id)) {
    return messages;
  }

  return [...messages, message];
}

function ConversationButton({
  conversation,
  isActive,
  onlineMap,
  onSelect,
  typingUser,
  userId,
}) {
  const others = getOtherParticipants(conversation, userId);
  const primary = others[0] ?? conversation.participants?.[0];
  const name = others.map(getParticipantName).join(", ") || "Conversation";
  const isOnline = others.some((participant) => onlineMap[participant.id]);
  const lastMessage = conversation.lastMessage?.text || "No messages yet";
  const unreadCount = conversation.unreadCounts?.[userId] ?? 0;

  return (
    <button
      className={`group rounded-[1.35rem] border p-4 text-left transition ${
        isActive
          ? "border-[#3F6212]/45 bg-[#3F6212] text-white shadow-[0_22px_70px_rgba(63, 98, 18, 0.24)]"
          : "border-black/10 bg-white text-black hover:-translate-y-0.5 hover:border-[#3F6212]/25 hover:shadow-[0_18px_55px_rgba(63, 98, 18, 0.12)]"
      }`}
      onClick={onSelect}
      type="button"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {primary?.avatar ? (
            <img
              alt=""
              className="h-11 w-11 rounded-2xl object-cover"
              src={primary.avatar}
            />
          ) : (
            <div className={`flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ${
              isActive ? "bg-white text-[#365314]" : "bg-[#3F6212]/10 text-[#365314]"
            }`}>
              {getInitials(name)}
            </div>
          )}
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 ${
              isOnline ? "bg-emerald-400" : "bg-black/20"
            } ${isActive ? "border-[#3F6212]" : "border-white"}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-bold">{name}</p>
            <span className="flex shrink-0 items-center gap-2">
              {unreadCount > 0 ? (
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                  isActive ? "bg-white text-[#365314]" : "bg-[#3F6212] text-white"
                }`}>
                  {unreadCount}
                </span>
              ) : null}
              <span className={`text-[11px] font-semibold ${
                isActive ? "text-white/64" : "text-black/42"
              }`}>
                {formatTime(conversation.lastMessageAt ?? conversation.updatedAt)}
              </span>
            </span>
          </div>
          <p className={`mt-1 line-clamp-1 text-xs ${
            isActive ? "text-white/72" : "text-black/52"
          }`}>
            {typingUser ? `${typingUser.name} is typing...` : lastMessage}
          </p>
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ isDeleting, message, onDelete, otherParticipants, userId }) {
  const isMine = message.senderId === userId;
  const readByOther = otherParticipants.some((participant) =>
    message.readBy?.includes(participant.id),
  );

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`group relative max-w-[82%] rounded-[1.35rem] border px-4 py-3 shadow-[0_16px_45px_rgba(63, 98, 18, 0.08)] ${
        isMine
          ? "border-[#3F6212]/35 bg-[#3F6212] text-white"
          : "border-black/10 bg-white text-black"
      }`}>
        <button
          className={`absolute -top-3 ${isMine ? "left-3" : "right-3"} rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] opacity-0 shadow-[0_12px_30px_rgba(63, 98, 18, 0.12)] transition group-hover:opacity-100 ${
            isMine
              ? "border-white/20 bg-white text-[#365314]"
              : "border-[#3F6212]/18 bg-white text-[#365314]"
          }`}
          disabled={isDeleting}
          onClick={() => onDelete(message._id)}
          type="button"
        >
          Delete
        </button>
        {message.isDeleted ? (
          <p className={`text-sm italic leading-6 ${isMine ? "text-white/68" : "text-black/42"}`}>
            Message deleted
          </p>
        ) : null}
        {!message.isDeleted && message.text ? (
          <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
        ) : null}
        {!message.isDeleted && message.attachments?.length ? (
          <div className="mt-3 grid gap-2">
            {message.attachments.map((attachment) => (
              <div key={attachment.url}>
                {attachment.type === "image" ? (
                  <a href={attachment.url} rel="noreferrer" target="_blank">
                    <img
                      alt={attachment.name || "Attachment"}
                      className="max-h-56 rounded-2xl object-cover"
                      src={attachment.url}
                    />
                  </a>
                ) : null}
                {attachment.type === "video" ? (
                  <video className="max-h-56 rounded-2xl" controls src={attachment.url} />
                ) : null}
                <a
                  className={`mt-2 block rounded-2xl border px-3 py-2 text-xs font-bold transition ${
                    isMine
                      ? "border-white/18 bg-white/12 text-white hover:bg-white/18"
                      : "border-[#3F6212]/14 bg-[#3F6212]/6 text-[#365314] hover:bg-[#3F6212]/10"
                  }`}
                  href={attachment.url}
                  rel="noreferrer"
                  target="_blank"
                >
                  {attachment.name || attachment.fileName || attachment.url}
                </a>
              </div>
            ))}
          </div>
        ) : null}
        <div className={`mt-2 flex items-center justify-end gap-2 text-[11px] font-semibold ${
          isMine ? "text-white/62" : "text-black/40"
        }`}>
          <span>{formatTime(message.createdAt)}</span>
          {isMine ? <span>{readByOther ? "Read" : "Sent"}</span> : null}
        </div>
      </div>
    </div>
  );
}

export function Messages() {
  const { isAuthenticated, token, user } = useAuth();
  const initialConversationFromUrl =
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("conversation") ?? "";
  const initialMessageTargetFromUrl =
    typeof window === "undefined"
      ? ""
      : new URLSearchParams(window.location.search).get("to") ?? "";
  const [activeConversationId, setActiveConversationId] = useState(() => {
    return initialConversationFromUrl;
  });
  const [attachmentType, setAttachmentType] = useState("other");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [conversationSearch, setConversationSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [blockedConversationIds, setBlockedConversationIds] = useState([]);
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(Boolean(initialConversationFromUrl));
  const [onlineMap, setOnlineMap] = useState({});
  const [participantId, setParticipantId] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [typingUsers, setTypingUsers] = useState({});
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const queryClient = useQueryClient();
  const { data: conversations = [], isLoading } = useQuery({
    enabled: isAuthenticated,
    queryFn: getConversations,
    queryKey: conversationQueryKey,
    staleTime: 15_000,
  });
  const activeConversation =
    conversations.find((conversation) => conversation._id === activeConversationId) ??
    conversations[0] ??
    null;
  const activeId = activeConversation?._id ?? "";
  const otherParticipants = getOtherParticipants(activeConversation, user?.id);
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    enabled: Boolean(activeId),
    queryFn: () => getConversationMessages(activeId),
    queryKey: queryKeys.messages.conversation(activeId),
    staleTime: 5_000,
  });
  const startConversationMutation = useMutation({
    mutationFn: startConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationQueryKey, (current = []) =>
        upsertConversation(current, conversation),
      );
      setActiveConversationId(conversation._id);
      setIsMobileChatOpen(true);
      setParticipantId("");
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(error.message ?? "Unable to start chat."),
  });
  const adminConversationMutation = useMutation({
    mutationFn: startAdminConversation,
    onSuccess: (conversation) => {
      queryClient.setQueryData(conversationQueryKey, (current = []) =>
        upsertConversation(current, conversation),
      );
      setActiveConversationId(conversation._id);
      setIsMobileChatOpen(true);
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(error.message ?? "Admin chat is unavailable."),
  });
  const sendMutation = useMutation({
    mutationFn: ({ conversationId, payload }) =>
      sendConversationMessage(conversationId, payload),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.messages.conversation(result.message.conversationId), (current = []) =>
        upsertMessage(current, result.message),
      );
      queryClient.setQueryData(conversationQueryKey, (current = []) =>
        upsertConversation(current, result.conversation),
      );
      setAttachmentUrl("");
      setDraft("");
      setSelectedFiles([]);
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(error.message ?? "Unable to send message."),
  });
  const deleteMessageMutation = useMutation({
    mutationFn: deleteConversationMessage,
    onSuccess: (message) => {
      queryClient.setQueryData(queryKeys.messages.conversation(message.conversationId), (current = []) =>
        current.filter((item) => item._id !== message._id),
      );
      setErrorMessage("");
    },
    onError: (error) => setErrorMessage(error.message ?? "Unable to delete message."),
  });
  const uploadAttachmentsMutation = useMutation({
    mutationFn: uploadMessageAttachments,
    onError: (error) => setErrorMessage(error.message ?? "Unable to upload attachments."),
  });
  const blockMutation = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      setBlockedConversationIds((current) => [...new Set([...current, activeId])]);
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setErrorMessage("User blocked. This conversation is now read-only.");
    },
    onError: (error) => setErrorMessage(error.message ?? "Unable to block user."),
  });

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const socket = createMessagingSocket(token);

    if (!socket) {
      socketRef.current = null;
      return undefined;
    }

    socketRef.current = socket;

    socket.on("message:new", ({ conversation, message }) => {
      queryClient.setQueryData(conversationQueryKey, (current = []) =>
        upsertConversation(current, conversation),
      );
      queryClient.setQueryData(queryKeys.messages.conversation(message.conversationId), (current = []) =>
        upsertMessage(current, message),
      );
    });
    socket.on("message:receive", ({ conversation, message }) => {
      queryClient.setQueryData(conversationQueryKey, (current = []) =>
        upsertConversation(current, conversation),
      );
      queryClient.setQueryData(queryKeys.messages.conversation(message.conversationId), (current = []) =>
        upsertMessage(current, message),
      );
    });
    socket.on("conversation:update", ({ conversation }) => {
      if (conversation?._id) {
        queryClient.setQueryData(conversationQueryKey, (current = []) =>
          upsertConversation(current, conversation),
        );
      }
    });

    socket.on("message:read", ({ conversationId, readerId }) => {
      queryClient.setQueryData(queryKeys.messages.conversation(conversationId), (current = []) =>
        current.map((message) => ({
          ...message,
          readBy: message.readBy?.includes(readerId)
            ? message.readBy
            : [...(message.readBy ?? []), readerId],
        })),
      );
    });

    socket.on("typing:update", ({ conversationId, isTyping, user: typingUser, userId }) => {
      if (userId === user?.id) {
        return;
      }

      setTypingUsers((current) => {
        const next = { ...current };

        if (!isTyping) {
          delete next[conversationId];
          return next;
        }

        next[conversationId] = typingUser;
        return next;
      });
    });
    socket.on("typing:start", ({ conversationId, user: typingUser, userId }) => {
      if (userId !== user?.id) {
        setTypingUsers((current) => ({ ...current, [conversationId]: typingUser }));
      }
    });
    socket.on("typing:stop", ({ conversationId, userId }) => {
      if (userId !== user?.id) {
        setTypingUsers((current) => {
          const next = { ...current };
          delete next[conversationId];
          return next;
        });
      }
    });

    socket.on("presence:update", ({ online, userId }) => {
      setOnlineMap((current) => ({ ...current, [userId]: online }));
    });
    socket.on("user:online", ({ userId }) => {
      setOnlineMap((current) => ({ ...current, [userId]: true }));
    });
    socket.on("user:offline", ({ userId }) => {
      setOnlineMap((current) => ({ ...current, [userId]: false }));
    });

    return () => {
      socket.disconnect();
      window.clearTimeout(typingTimeoutRef.current);
      socketRef.current = null;
    };
  }, [queryClient, token, user?.id]);

  useEffect(() => {
    if (!activeId || !socketRef.current) {
      return undefined;
    }

    socketRef.current.emit("conversation:join", { conversationId: activeId });

    return () => {
      socketRef.current?.emit("conversation:leave", { conversationId: activeId });
    };
  }, [activeId]);

  useEffect(() => {
    const ids = conversations.flatMap((conversation) =>
      getOtherParticipants(conversation, user?.id).map((participant) => participant.id),
    );

    if (!ids.length) {
      return;
    }

    getPresence(ids)
      .then((items) => {
        setOnlineMap((current) => ({
          ...current,
          ...Object.fromEntries(items.map((item) => [item.userId, item.online])),
        }));
      })
      .catch(() => {});

    socketRef.current?.emit("presence:get", { userIds: ids }, (response) => {
      if (response?.success) {
        setOnlineMap((current) => ({
          ...current,
          ...Object.fromEntries(response.data.map((item) => [item.userId, item.online])),
        }));
      }
    });
  }, [conversations, user?.id]);

  useEffect(() => {
    if (!activeId || messages.length === 0) {
      return;
    }

    markConversationRead(activeId).catch(() => {});
  }, [activeId, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, activeId]);

  const activeTypingUser = typingUsers[activeId];
  const isActiveConversationBlocked = blockedConversationIds.includes(activeId);
  const onlineCount = useMemo(
    () => Object.values(onlineMap).filter(Boolean).length,
    [onlineMap],
  );
  const filteredConversations = useMemo(() => {
    const query = conversationSearch.trim().toLowerCase();

    if (!query) {
      return conversations;
    }

    return conversations.filter((conversation) => {
      const participantNames = getOtherParticipants(conversation, user?.id)
        .map(getParticipantName)
        .join(" ")
        .toLowerCase();
      const lastMessage = String(conversation.lastMessage?.text ?? "").toLowerCase();
      const subject = String(conversation.subject ?? "").toLowerCase();

      return [participantNames, lastMessage, subject].some((value) => value.includes(query));
    });
  }, [conversationSearch, conversations, user?.id]);

  function submitStartConversation(event) {
    event.preventDefault();

    if (!participantId.trim()) {
      setErrorMessage("Enter a user id to start a one-to-one chat.");
      return;
    }

    startConversationMutation.mutate(participantId.trim());
  }

  function emitTyping(nextDraft) {
    if (!activeId || !socketRef.current) {
      return;
    }

    socketRef.current.emit(nextDraft ? "typing:start" : "typing:stop", {
      conversationId: activeId,
    });
    window.clearTimeout(typingTimeoutRef.current);

    if (nextDraft) {
      typingTimeoutRef.current = window.setTimeout(() => {
        socketRef.current?.emit("typing:stop", { conversationId: activeId });
      }, 1200);
    }
  }

  function updateDraft(event) {
    const value = event.target.value;
    setDraft(value);
    emitTyping(value.trim());
  }

  async function submitMessage(event) {
    event.preventDefault();

    const cleanText = draft.trim();
    const cleanAttachmentUrl = attachmentUrl.trim();

    if (!activeId || (!cleanText && !cleanAttachmentUrl && selectedFiles.length === 0)) {
      return;
    }

    emitTyping("");
    let uploadedAttachments = [];

    try {
      uploadedAttachments =
        selectedFiles.length > 0
          ? await uploadAttachmentsMutation.mutateAsync(selectedFiles)
          : [];
    } catch {
      return;
    }
    sendMutation.mutate({
      conversationId: activeId,
      payload: {
        attachments: [
          ...uploadedAttachments,
          ...(cleanAttachmentUrl
            ? [
              {
                name: cleanAttachmentUrl.split("/").pop() || "Attachment",
                type: attachmentType,
                url: cleanAttachmentUrl,
              },
            ]
            : []),
        ],
        text: cleanText,
      },
    });
  }

  return (
    <SaaSLayout eyebrow="Realtime" title="Messages">
      <div className="grid min-w-0 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className={`${isMobileChatOpen ? "hidden" : "block"} min-w-0 rounded-[2rem] border border-[#3F6212]/14 bg-white p-4 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)] xl:block`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3F6212]">
                Inbox
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-[-0.05em] text-black">
                Conversations
              </h2>
              <p className="mt-2 text-sm leading-6 text-black/52">
                {onlineCount} contact{onlineCount === 1 ? "" : "s"} online
              </p>
            </div>
            <button
              className="rounded-full bg-black px-4 py-2 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#3F6212] hover:shadow-[0_16px_45px_rgba(63, 98, 18, 0.2)]"
              disabled={adminConversationMutation.isPending}
              onClick={() => adminConversationMutation.mutate()}
              type="button"
            >
              Admin Chat
            </button>
          </div>

          <div className="mt-5">
            <input
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
              onChange={(event) => setConversationSearch(event.target.value)}
              placeholder="Search conversations"
              value={conversationSearch}
            />
          </div>

          <form className="mt-5 grid gap-2" onSubmit={submitStartConversation}>
            <input
              className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
              onChange={(event) => {
                setParticipantId(event.target.value);
                setErrorMessage("");
              }}
              placeholder="Start chat by user id"
              value={participantId}
            />
            <button
              className="rounded-2xl border border-[#3F6212]/18 bg-[#3F6212]/8 px-4 py-3 text-sm font-bold text-[#365314] transition hover:bg-[#3F6212] hover:text-white"
              disabled={startConversationMutation.isPending}
              type="submit"
            >
              Start One-to-One Chat
            </button>
          </form>

          {errorMessage ? (
            <StatusBanner className="mt-4" tone="error">
              {errorMessage}
            </StatusBanner>
          ) : null}

          {initialMessageTargetFromUrl ? (
            <StatusBanner className="mt-4">
              Messaging with @{initialMessageTargetFromUrl} will be available once
              the messaging module is connected to profile usernames.
            </StatusBanner>
          ) : null}

          <div className="mt-5 grid max-h-[62vh] gap-3 overflow-y-auto pr-1">
            {isLoading ? <LoadingState columns={3} /> : null}
            {!isLoading && conversations.length === 0 ? (
              <EmptyState
                description={
                  initialMessageTargetFromUrl
                    ? `Messaging with @${initialMessageTargetFromUrl} will be available once the messaging module is connected.`
                    : "Start an admin chat or enter a user id to open a direct conversation."
                }
                title="No conversations yet"
              />
            ) : null}
            {!isLoading && conversations.length > 0 && filteredConversations.length === 0 ? (
              <EmptyState
                description="Try another name, subject, or message keyword."
                title="No matching conversations"
              />
            ) : null}
            {filteredConversations.map((conversation) => (
              <ConversationButton
                conversation={conversation}
                isActive={conversation._id === activeId}
                key={conversation._id}
                onlineMap={onlineMap}
                onSelect={() => {
                  setActiveConversationId(conversation._id);
                  setIsMobileChatOpen(true);
                }}
                typingUser={typingUsers[conversation._id]}
                userId={user?.id}
              />
            ))}
          </div>
        </aside>

        <section className={`${isMobileChatOpen ? "flex" : "hidden"} min-h-[34rem] min-w-0 flex-col overflow-hidden rounded-[2rem] border border-[#3F6212]/14 bg-[radial-gradient(circle_at_top_right,rgba(63, 98, 18, 0.12),transparent_34%),linear-gradient(180deg,#ffffff,#fefce8)] shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)] xl:flex xl:h-[calc(100vh-15rem)] xl:min-h-[36rem]`}>
          {activeConversation ? (
            <>
              <header className="border-b border-black/10 bg-white/82 px-5 py-4 backdrop-blur-xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <button
                      className="mb-3 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black/58 transition hover:border-[#3F6212]/35 hover:text-[#365314] xl:hidden"
                      onClick={() => setIsMobileChatOpen(false)}
                      type="button"
                    >
                      Back to conversations
                    </button>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#3F6212]">
                      Live chat
                    </p>
                    <h2 className="mt-1 break-words text-2xl font-bold tracking-normal text-black">
                      {otherParticipants.map(getParticipantName).join(", ") || "Conversation"}
                    </h2>
                    <p className="mt-1 text-sm text-black/52">
                      {activeTypingUser
                        ? `${activeTypingUser.name} is typing...`
                        : otherParticipants.some((participant) => onlineMap[participant.id])
                          ? "Online now"
                          : "Messages deliver when they reconnect"}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-3 py-1 text-xs font-bold text-[#365314]">
                      {messages.length} messages
                    </span>
                    {otherParticipants[0]?.id ? (
                      <button
                        className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold text-black/52 transition hover:border-[#3F6212]/35 hover:bg-[#3F6212] hover:text-white disabled:opacity-50"
                        disabled={blockMutation.isPending || isActiveConversationBlocked}
                        onClick={() => blockMutation.mutate(otherParticipants[0].id)}
                        type="button"
                      >
                        {isActiveConversationBlocked ? "Blocked" : "Block"}
                      </button>
                    ) : null}
                  </div>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                <div className="grid gap-3">
                  {isMessagesLoading ? <LoadingState columns={3} /> : null}
                  {!isMessagesLoading && messages.length === 0 ? (
                    <EmptyState
                      description="Send the first message. Delivery, typing, and read status update live."
                      title="No messages yet"
                    />
                  ) : null}
                  {messages.map((message) => (
                    <MessageBubble
                      isDeleting={deleteMessageMutation.isPending}
                      key={message._id}
                      message={message}
                      onDelete={(messageId) => deleteMessageMutation.mutate(messageId)}
                      otherParticipants={otherParticipants}
                      userId={user?.id}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <form className="border-t border-black/10 bg-white p-4" onSubmit={submitMessage}>
                {isActiveConversationBlocked ? (
                  <StatusBanner className="mb-3" tone="error">
                    Messaging is disabled because this user is blocked.
                  </StatusBanner>
                ) : null}
                <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
                  <input
                    className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    onChange={(event) => setAttachmentUrl(event.target.value)}
                    placeholder="Optional attachment URL"
                    value={attachmentUrl}
                  />
                  <select
                    className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-bold text-black outline-none transition focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    onChange={(event) => setAttachmentType(event.target.value)}
                    value={attachmentType}
                  >
                    <option value="other">Attachment</option>
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                    <option value="document">Document</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div className="mt-3 grid gap-2 rounded-2xl border border-dashed border-[#3F6212]/18 bg-[#3F6212]/5 p-3">
                  <label className="text-xs font-bold uppercase tracking-[0.16em] text-[#365314]">
                    Attach files
                    <input
                      accept="image/*,video/mp4,video/webm,application/pdf,text/plain"
                      className="mt-2 block w-full text-sm font-semibold text-black/58 file:mr-4 file:rounded-xl file:border-0 file:bg-[#3F6212] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
                      multiple
                      onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
                      type="file"
                    />
                  </label>
                  {selectedFiles.length ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedFiles.map((file) => (
                        <button
                          className="rounded-full border border-[#3F6212]/18 bg-white px-3 py-1 text-left text-xs font-bold text-black/58 transition hover:border-[#3F6212]/35 hover:text-[#365314]"
                          key={`${file.name}-${file.size}`}
                          onClick={() =>
                            setSelectedFiles((current) =>
                              current.filter((item) => item !== file),
                            )
                          }
                          type="button"
                        >
                          {file.name} - remove
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <textarea
                    className="min-h-20 flex-1 resize-none rounded-[1.35rem] border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                    onChange={updateDraft}
                    placeholder="Write a message..."
                    value={draft}
                  />
                  <button
                    className="rounded-[1.35rem] bg-[#3F6212] px-7 py-4 text-sm font-bold text-white shadow-[0_18px_50px_rgba(63, 98, 18, 0.26)] transition hover:-translate-y-0.5 hover:bg-[#365314] disabled:cursor-not-allowed disabled:opacity-60 sm:w-36"
                    disabled={
                      isActiveConversationBlocked ||
                      sendMutation.isPending ||
                      uploadAttachmentsMutation.isPending ||
                      (!draft.trim() && !attachmentUrl.trim() && selectedFiles.length === 0)
                    }
                    type="submit"
                  >
                    {sendMutation.isPending || uploadAttachmentsMutation.isPending
                      ? "Sending..."
                      : "Send"}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8">
              <EmptyState
                description={
                  initialMessageTargetFromUrl
                    ? `Messaging with @${initialMessageTargetFromUrl} will be available once the messaging module is connected.`
                    : "Choose a conversation or start a new chat from the sidebar."
                }
                title="Select a conversation"
              />
            </div>
          )}
        </section>
      </div>
    </SaaSLayout>
  );
}
