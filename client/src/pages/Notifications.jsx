import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys.js";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/api.js";
import { formatDate } from "../utils/index.js";

const eventLabels = {
  campaign_update: "Campaign",
  connection_accepted: "Connection",
  connection_request: "Connection",
  new_message: "Message",
  new_proposal: "Proposal",
  payment_update: "Payment",
  project_update: "Project",
  system_update: "System",
};

const typeFilters = [
  ["", "All"],
  ["message", "Messages"],
  ["connection", "Connections"],
  ["project", "Projects"],
  ["payment", "Payments"],
  ["system", "System"],
];

function getToneClasses(eventType, isUnread) {
  if (isUnread) {
    return "border-[#3F6212]/32 bg-[radial-gradient(circle_at_top_right,rgba(63, 98, 18, 0.14),transparent_30%),#ffffff] shadow-[0_22px_70px_rgba(63, 98, 18, 0.13)]";
  }

  if (eventType === "payment_update") {
    return "border-[#65A30D]/18 bg-[#fefce8]";
  }

  return "border-black/10 bg-white";
}

function NotificationCard({ notification, onDelete, onRead, isDeleting, isMarking }) {
  const isUnread = !notification.read;

  return (
    <article
      className={`group relative overflow-hidden rounded-[1.6rem] border p-5 transition duration-300 hover:-translate-y-0.5 hover:border-[#3F6212]/45 hover:shadow-[0_24px_75px_rgba(63, 98, 18, 0.16)] ${getToneClasses(notification.eventType, isUnread)}`}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#3F6212]/10 blur-2xl transition duration-500 group-hover:bg-[#3F6212]/18"
      />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#365314]">
              {eventLabels[notification.eventType] ?? "Update"}
            </span>
            {isUnread ? (
              <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                New
              </span>
            ) : null}
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-[-0.05em] text-black">
            {notification.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-black/58">
            {notification.message}
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-black/38">
            {formatDate(notification.createdAt, {
              day: "numeric",
              fallback: "",
              hour: "numeric",
              minute: "2-digit",
              month: "short",
            })}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {notification.actionUrl ? (
            <Button as="a" className="min-h-10 px-4 py-2" href={notification.actionUrl} variant="outline">
              Open
            </Button>
          ) : null}
          {isUnread ? (
            <Button
              className="min-h-10 px-4 py-2"
              disabled={isMarking}
              onClick={() => onRead(notification._id)}
              variant="secondary"
            >
              Mark Read
            </Button>
          ) : null}
          <Button
            className="min-h-10 px-4 py-2"
            disabled={isDeleting}
            onClick={() => onDelete(notification._id)}
            variant="outline"
          >
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}

export function Notifications() {
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () => queryKeys.notifications.list({ type: selectedType, unreadOnly: showUnreadOnly }),
    [selectedType, showUnreadOnly],
  );
  const {
    data: notifications = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryFn: () => getNotifications({ type: selectedType, unreadOnly: showUnreadOnly }),
    queryKey,
    staleTime: 10_000,
  });
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
  const unreadCount = notifications.filter((notification) => !notification.read).length;

  return (
    <SaaSLayout eyebrow="Notification center" title="Updates that need attention">
      <section className="grid gap-6">
        <div className="overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_90%_10%,rgba(63, 98, 18, 0.16),transparent_30%),linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3F6212]">
                Live workspace signals
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-[-0.065em] text-black md:text-5xl">
                Messages, proposals, projects, and billing in one feed.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-black/58">
                Review important events without digging through every dashboard section.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                className={`rounded-full border px-5 py-3 text-sm font-bold transition hover:-translate-y-0.5 ${
                  showUnreadOnly
                    ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_18px_50px_rgba(63, 98, 18, 0.24)]"
                    : "border-black/10 bg-white text-black hover:border-[#3F6212]/35 hover:text-[#365314]"
                }`}
                onClick={() => setShowUnreadOnly((current) => !current)}
                type="button"
              >
                {showUnreadOnly ? "Showing Unread" : "Unread Only"}
              </button>
              <Button
                disabled={markAllMutation.isPending || unreadCount === 0}
                onClick={() => markAllMutation.mutate()}
                variant="primary"
              >
                Mark All Read
              </Button>
            </div>
          </div>
        </div>

        {isError ? (
          <StatusBanner tone="error">
            {error?.message ?? "Unable to load notifications."}
          </StatusBanner>
        ) : null}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {typeFilters.map(([value, label]) => {
            const isActive = selectedType === value;

            return (
              <button
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${
                  isActive
                    ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_16px_40px_rgba(63, 98, 18, 0.18)]"
                    : "border-black/10 bg-white text-black/58 hover:border-[#3F6212]/35 hover:text-[#365314]"
                }`}
                key={value || "all"}
                onClick={() => setSelectedType(value)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4">
          {isLoading ? <LoadingState columns={4} /> : null}
          {!isLoading && notifications.length === 0 ? (
            <EmptyState
              description={
                showUnreadOnly
                  ? "There are no unread notifications right now."
                  : "New messages, proposals, connection requests, project updates, and payment updates will appear here."
              }
              title="No notifications yet"
            />
          ) : null}
          {notifications.map((notification) => (
            <NotificationCard
              isDeleting={deleteMutation.isPending}
              isMarking={markReadMutation.isPending}
              key={notification._id}
              notification={notification}
              onDelete={(notificationId) => deleteMutation.mutate(notificationId)}
              onRead={(notificationId) => markReadMutation.mutate(notificationId)}
            />
          ))}
        </div>
      </section>
    </SaaSLayout>
  );
}
