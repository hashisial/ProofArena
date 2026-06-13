import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import {
  acceptConnection,
  deleteConnection,
  getAcceptedConnections,
  getConnectionSuggestions,
  getReceivedConnectionRequests,
  getSentConnectionRequests,
  rejectConnection,
  requestConnection,
  startConversation,
} from "../services/api.js";
import { getInitials } from "../utils/index.js";

const tabs = [
  ["connections", "My Connections"],
  ["received", "Received Requests"],
  ["sent", "Sent Requests"],
  ["suggested", "Suggested People"],
];

function getDisplayName(user = {}) {
  return user.fullName || user.name || user.email || "User";
}

function ConnectionCard({
  connection,
  isBusy,
  onDelete,
  onMessage,
  onRespond,
}) {
  const other = connection.otherUser ?? {};
  const name = getDisplayName(other);
  const isIncomingPending =
    connection.status === "pending" && connection.direction === "received";
  const canMessage = connection.status === "accepted";

  return (
    <article className="group relative overflow-hidden rounded-[1.8rem] border border-black/10 bg-white p-5 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] transition hover:-translate-y-0.5 hover:border-[#3F6212]/38 hover:shadow-[0_28px_90px_rgba(63, 98, 18, 0.15)]">
      <div aria-hidden="true" className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-[#3F6212]/10 blur-3xl transition group-hover:bg-[#3F6212]/18" />
      <div className="relative grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        {other.avatar ? (
          <img alt="" className="h-16 w-16 rounded-[1.35rem] object-cover shadow-[0_18px_45px_rgba(63, 98, 18, 0.12)]" src={other.avatar} />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-black text-lg font-black text-white shadow-[0_18px_45px_rgba(0,0,0,0.14)]">
            {getInitials(name)}
          </div>
        )}

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#365314]">
              {connection.status}
            </span>
            <span className="rounded-full border border-black/10 bg-[#fefce8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-black/48">
              {connection.direction}
            </span>
          </div>
          <h2 className="mt-3 truncate text-2xl font-black tracking-[-0.055em] text-black">
            {name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm font-medium leading-6 text-black/58">
            {other.headline || `${other.role ?? "User"} account${other.location ? ` in ${other.location}` : ""}`}
          </p>
        </div>

        <div className="grid gap-2 sm:min-w-40">
          {isIncomingPending ? (
            <>
              <Button
                className="min-h-10 px-4 py-2"
                disabled={isBusy}
                onClick={() => onRespond(connection, "accepted")}
              >
                Accept
              </Button>
              <Button
                className="min-h-10 px-4 py-2"
                disabled={isBusy}
                onClick={() => onRespond(connection, "rejected")}
                variant="outline"
              >
                Reject
              </Button>
            </>
          ) : (
            <>
              <Button
                className="min-h-10 px-4 py-2"
                disabled={!canMessage || isBusy}
                onClick={() => onMessage(other.id || other._id)}
              >
                Message
              </Button>
              <Button
                as="a"
                className="min-h-10 px-4 py-2"
                href={other.publicUrl || "/network"}
                variant="outline"
              >
                Profile
              </Button>
            </>
          )}
          <Button
            className="min-h-10 px-4 py-2"
            disabled={isBusy}
            onClick={() => onDelete(connection)}
            variant="secondary"
          >
            Remove
          </Button>
        </div>
      </div>
    </article>
  );
}

function CandidateCard({ candidate, isBusy, onConnect, onMessage }) {
  const name = getDisplayName(candidate);
  const canRequest = ["none", "rejected"].includes(candidate.connectionStatus);
  const canMessage = candidate.connectionStatus === "accepted";
  const requestLabel =
    candidate.connectionStatus === "accepted"
      ? "Connected"
      : candidate.connectionStatus === "pending"
        ? "Requested"
        : candidate.connectionStatus === "rejected"
          ? "Request again"
          : "Connect";

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-white p-4 shadow-[0_18px_55px_rgba(63, 98, 18, 0.07)] transition hover:-translate-y-0.5 hover:border-[#3F6212]/35 hover:shadow-[0_24px_70px_rgba(63, 98, 18, 0.13)]">
      <div className="flex gap-4">
        {candidate.avatar ? (
          <img alt="" className="h-14 w-14 rounded-2xl object-cover" src={candidate.avatar} />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#3F6212] text-sm font-black text-white shadow-[0_16px_38px_rgba(63, 98, 18, 0.2)]">
            {getInitials(name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-black tracking-[-0.035em] text-black">
              {name}
            </h3>
            <span className="rounded-full bg-[#3F6212]/8 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#365314]">
              {candidate.role ?? "client"}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-5 text-black/56">
            {candidate.headline || candidate.location || "Marketplace member"}
          </p>
          {candidate.connectionStatus !== "none" ? (
            <p className="mt-2 text-xs font-black uppercase tracking-[0.14em] text-black/42">
              {candidate.connection?.direction ?? "connected"} - {candidate.connectionStatus}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button
          className="min-h-10 px-4 py-2"
          disabled={!canRequest || isBusy}
          onClick={() => onConnect(candidate.id || candidate._id)}
        >
          {requestLabel}
        </Button>
        <Button
          className="min-h-10 px-4 py-2"
          disabled={!canMessage || isBusy}
          onClick={() => onMessage(candidate.id || candidate._id)}
          variant="outline"
        >
          Message
        </Button>
      </div>
    </article>
  );
}

export function Connections() {
  const [activeTab, setActiveTab] = useState("connections");
  const [receiverId, setReceiverId] = useState("");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const acceptedQuery = useQuery({
    queryFn: getAcceptedConnections,
    queryKey: ["connections", "accepted"],
    staleTime: 15_000,
  });
  const receivedQuery = useQuery({
    queryFn: getReceivedConnectionRequests,
    queryKey: ["connections", "received"],
    staleTime: 15_000,
  });
  const sentQuery = useQuery({
    queryFn: getSentConnectionRequests,
    queryKey: ["connections", "sent"],
    staleTime: 15_000,
  });
  const suggestionsQuery = useQuery({
    enabled: activeTab === "suggested",
    queryFn: () =>
      getConnectionSuggestions({
        limit: 18,
        q: submittedSearch,
      }),
    queryKey: ["connections", "suggestions", submittedSearch],
    staleTime: 20_000,
  });
  const activeListQuery =
    activeTab === "received"
      ? receivedQuery
      : activeTab === "sent"
        ? sentQuery
        : acceptedQuery;
  const activeConnections = activeTab === "suggested" ? [] : activeListQuery.data ?? [];
  const candidates = activeTab === "suggested" ? suggestionsQuery.data ?? [] : [];
  const isListLoading =
    activeTab === "suggested" ? suggestionsQuery.isLoading : activeListQuery.isLoading;
  const isListError =
    activeTab === "suggested" ? suggestionsQuery.isError : activeListQuery.isError;
  const listError =
    activeTab === "suggested" ? suggestionsQuery.error : activeListQuery.error;
  const requestMutation = useMutation({
    mutationFn: requestConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setReceiverId("");
      setMessage("Connection request sent.");
    },
    onError: (mutationError) =>
      setMessage(mutationError.message ?? "Unable to send connection request."),
  });
  const responseMutation = useMutation({
    mutationFn: ({ connectionId, nextStatus }) =>
      nextStatus === "accepted"
        ? acceptConnection(connectionId)
        : rejectConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setMessage("Connection updated.");
    },
    onError: (mutationError) =>
      setMessage(mutationError.message ?? "Unable to update connection."),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections"] });
      setMessage("Connection removed.");
    },
    onError: (mutationError) =>
      setMessage(mutationError.message ?? "Unable to remove connection."),
  });
  const messageMutation = useMutation({
    mutationFn: startConversation,
    onSuccess: (conversation) => {
      if (conversation?._id) {
        window.location.href = "/messages";
      }
    },
    onError: (mutationError) =>
      setMessage(mutationError.message ?? "Unable to open conversation."),
  });
  const acceptedCount = acceptedQuery.data?.length ?? 0;
  const receivedCount = receivedQuery.data?.length ?? 0;
  const sentCount = sentQuery.data?.length ?? 0;
  const pendingCount = receivedCount + sentCount;

  function submitRequest(event) {
    event.preventDefault();

    if (!receiverId.trim()) {
      setMessage("Enter a user id to send a connection request.");
      return;
    }

    setMessage("");
    requestMutation.mutate(receiverId.trim());
  }

  function submitSearch(event) {
    event.preventDefault();
    setActiveTab("suggested");
    setSubmittedSearch(search.trim());
  }

  const emptyCopy = {
    connections: [
      "No accepted connections yet",
      "Accepted clients, providers, and collaborators will appear here.",
    ],
    received: [
      "No received requests",
      "Incoming connection requests will appear here when someone wants to connect.",
    ],
    sent: [
      "No sent requests",
      "Requests you send will stay here until the other person responds.",
    ],
    suggested: [
      "No suggested people found",
      "Try a different name, skill, location, or company.",
    ],
  }[activeTab];

  return (
    <SaaSLayout eyebrow="Network" title="Connections">
      <section className="grid gap-6">
        <div className="overflow-hidden rounded-[2.2rem] border border-[#3F6212]/14 bg-[radial-gradient(circle_at_86%_14%,rgba(63, 98, 18, 0.16),transparent_32%),linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] md:p-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#3F6212]">
                Relationship graph
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.075em] text-black md:text-6xl">
                Manage requests, accepted contacts, and chat paths.
              </h1>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  ["Total", acceptedCount + pendingCount],
                  ["Accepted", acceptedCount],
                  ["Pending", pendingCount],
                ].map(([label, value]) => (
                  <div className="rounded-[1.25rem] border border-black/10 bg-white p-4" key={label}>
                    <p className="text-3xl font-black tracking-[-0.06em] text-black">{value}</p>
                    <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-black/42">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <form className="rounded-[1.6rem] border border-black/10 bg-white p-4 shadow-[0_18px_55px_rgba(63, 98, 18, 0.08)]" onSubmit={submitRequest}>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
                Direct request
              </p>
              <input
                className="mt-4 w-full rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                onChange={(event) => setReceiverId(event.target.value)}
                placeholder="Paste user id"
                value={receiverId}
              />
              <Button className="mt-3 w-full" isLoading={requestMutation.isPending} type="submit">
                Send request
              </Button>
            </form>
          </div>
        </div>

        <section className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_24px_75px_rgba(63, 98, 18, 0.08)] md:p-6">
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#3F6212]">
                Discover people
              </p>
              <h2 className="mt-3 text-3xl font-black leading-[0.98] tracking-[-0.06em] text-black">
                Search clients and providers by profile signal.
              </h2>
              <form className="mt-5 grid gap-3" onSubmit={submitSearch}>
                <input
                  className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, username, skill, city, company"
                  value={search}
                />
                <div className="flex flex-wrap gap-2">
                  <Button className="min-h-11 px-5 py-2.5" type="submit">
                    Search Network
                  </Button>
                  {submittedSearch ? (
                    <Button
                      className="min-h-11 px-5 py-2.5"
                      onClick={() => {
                        setSearch("");
                        setSubmittedSearch("");
                      }}
                      type="button"
                      variant="outline"
                    >
                      Clear
                    </Button>
                  ) : null}
                </div>
              </form>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Received", receivedCount, "Requests waiting for your response"],
                ["Sent", sentCount, "People you have already contacted"],
                ["Suggested", candidates.length, "Profile-matched people to review"],
              ].map(([label, value, description]) => (
                <div
                  className="rounded-[1.35rem] border border-black/10 bg-[#fefce8] p-4 transition hover:border-[#3F6212]/30 hover:bg-white hover:shadow-[0_18px_50px_rgba(63, 98, 18, 0.1)]"
                  key={label}
                >
                  <p className="text-2xl font-black tracking-[-0.055em] text-black">{value}</p>
                  <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-[#3F6212]">{label}</p>
                  <p className="mt-2 text-sm font-medium leading-5 text-black/52">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {message ? <StatusBanner>{message}</StatusBanner> : null}
        {isListError ? (
          <StatusBanner tone="error">
            {listError?.message ?? "Unable to load connections."}
          </StatusBanner>
        ) : null}

        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map(([value, label]) => {
            const isActive = activeTab === value;

            return (
              <button
                className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition ${
                  isActive
                    ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_18px_48px_rgba(63, 98, 18, 0.22)]"
                    : "border-black/10 bg-white text-black/58 hover:border-[#3F6212]/35 hover:bg-[#3F6212] hover:text-white"
                }`}
                key={value}
                onClick={() => setActiveTab(value)}
                type="button"
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-4">
          {isListLoading ? <LoadingState columns={4} /> : null}
          {!isListLoading && activeTab === "suggested" && candidates.length === 0 ? (
            <EmptyState
              description={emptyCopy[1]}
              title={emptyCopy[0]}
            />
          ) : null}
          {!isListLoading && activeTab !== "suggested" && activeConnections.length === 0 ? (
            <EmptyState
              description={emptyCopy[1]}
              title={emptyCopy[0]}
            />
          ) : null}
          {activeTab === "suggested"
            ? candidates.map((candidate) => (
                <CandidateCard
                  candidate={candidate}
                  isBusy={requestMutation.isPending || messageMutation.isPending}
                  key={candidate.id || candidate._id}
                  onConnect={(userId) => requestMutation.mutate(userId)}
                  onMessage={(userId) => messageMutation.mutate(userId)}
                />
              ))
            : activeConnections.map((connection) => (
                <ConnectionCard
                  connection={connection}
                  isBusy={responseMutation.isPending || deleteMutation.isPending || messageMutation.isPending}
                  key={connection._id}
                  onDelete={(item) => deleteMutation.mutate(item._id)}
                  onMessage={(userId) => messageMutation.mutate(userId)}
                  onRespond={(item, nextStatus) =>
                    responseMutation.mutate({
                      connectionId: item._id,
                      nextStatus,
                    })
                  }
                />
              ))}
        </div>
      </section>
    </SaaSLayout>
  );
}
