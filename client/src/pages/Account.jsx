import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useMyLeads } from "../hooks/useMyLeads.js";
import { formatDateTime } from "../utils/index.js";

function AccountGate({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <Container>
        <LoadingState columns={3} />
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container size="narrow">
        <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/25 backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Protected
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white">
            Login required
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-slate-300">
            Your workspace is protected with JWT authentication.
          </p>
          <Button as="a" className="mt-6" href="/login">
            Login or Register
          </Button>
        </div>
      </Container>
    );
  }

  return children;
}

function LeadCard({ isActive, lead, onClick }) {
  return (
    <button
      className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.08] ${
        isActive
          ? "border-cyan-300/40 bg-cyan-300/10"
          : "border-white/10 bg-slate-950/45"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-white">{lead.service}</p>
          <p className="mt-1 text-sm text-slate-400">{lead.email}</p>
        </div>
        <span className="shrink-0 text-xs text-slate-500">
          {formatDateTime(lead.createdAt, { fallback: "No date", locale: "en" })}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-300">
        {lead.message}
      </p>
    </button>
  );
}

function LeadDetails({ lead }) {
  if (!lead) {
    return (
      <EmptyState
        description="Submit a growth request while logged in and it will appear here."
        title="No requests yet"
      />
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-300/20 bg-white/[0.07] p-6 shadow-2xl shadow-cyan-950/20 backdrop-blur-xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Request
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
            {lead.service}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Submitted {formatDateTime(lead.createdAt, { fallback: "No date", locale: "en" })}
          </p>
        </div>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-sm font-bold text-emerald-100">
          Received
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/60 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
          Message
        </p>
        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
          {lead.message}
        </p>
      </div>
    </div>
  );
}

function AccountDashboard() {
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedLeadId, setSelectedLeadId] = useState("");
  const { signOut, user } = useAuth();
  const { error, isEmpty, isError, isLoading, leads } = useMyLeads(sortOrder);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead._id === selectedLeadId) ?? leads[0] ?? null,
    [leads, selectedLeadId],
  );

  function handleSignOut() {
    signOut();
    window.location.href = "/";
  }

  return (
    <Container>
      <div className="grid gap-8">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.05] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Client Workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">
              Welcome back, {user?.name}
            </h1>
          </div>
          <Button onClick={handleSignOut} variant="secondary">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                  Your Data
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-white">
                  Growth requests
                </h2>
              </div>
              <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-slate-950/60 p-1">
                {[
                  ["desc", "Newest"],
                  ["asc", "Oldest"],
                ].map(([value, label]) => (
                  <button
                    aria-pressed={sortOrder === value}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      sortOrder === value
                        ? "bg-cyan-300 text-slate-950"
                        : "text-slate-300 hover:text-white"
                    }`}
                    key={value}
                    onClick={() => setSortOrder(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid max-h-[560px] gap-3 overflow-y-auto pr-1">
              {isLoading ? <LoadingState columns={2} /> : null}
              {isError ? <StatusBanner tone="error">{error}</StatusBanner> : null}
              {isEmpty ? (
                <EmptyState
                  description="Use the contact form while logged in to create your first request."
                  title="No requests yet"
                />
              ) : null}
              {!isLoading &&
                !isError &&
                leads.map((lead) => (
                  <LeadCard
                    isActive={selectedLead?._id === lead._id}
                    key={lead._id}
                    lead={lead}
                    onClick={() => setSelectedLeadId(lead._id)}
                  />
                ))}
            </div>
          </div>

          <LeadDetails lead={selectedLead} />
        </div>
      </div>
    </Container>
  );
}

export function Account() {
  return (
    <section className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.16),transparent_30%),linear-gradient(180deg,#020617,#06111f)] py-20">
      <AccountGate>
        <SectionHeading
          className="mx-auto mb-10 max-w-3xl text-center"
          description="Your protected workspace keeps submitted requests scoped to your account."
          eyebrow="Account"
          title="Project activity in one place."
        />
        <AccountDashboard />
      </AccountGate>
    </section>
  );
}
