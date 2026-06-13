import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { createProject, getProjects, updateProject } from "../services/api.js";

const initialProjectForm = {
  budget: "",
  deadline: "",
  description: "",
  providerId: "",
  title: "",
};

const statusColumns = [
  {
    accent: "bg-[#3F6212]",
    description: "New scopes waiting for provider alignment.",
    label: "Open",
    status: "open",
  },
  {
    accent: "bg-[#65A30D]",
    description: "Active delivery work with payment and messaging context.",
    label: "In Progress",
    status: "in_progress",
  },
  {
    accent: "bg-black",
    description: "Finished work ready for review or payment release.",
    label: "Completed",
    status: "completed",
  },
];

function formatBudget(value) {
  const budget = Number(value);

  if (!Number.isFinite(budget) || budget <= 0) {
    return "Budget TBD";
  }

  return `$${budget.toLocaleString()}`;
}

function formatDeadline(value) {
  if (!value) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function getPersonName(person, fallback) {
  if (!person) {
    return fallback;
  }

  return person.name || person.fullName || person.username || person.email || fallback;
}

function ProjectCard({ isUpdating, onStatusChange, project }) {
  return (
    <article className="group rounded-[1.6rem] border border-black/10 bg-white p-4 shadow-[0_18px_55px_rgba(63, 98, 18, 0.07)] transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/36 hover:shadow-[0_26px_80px_rgba(63, 98, 18, 0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#3F6212]">
            {project.status.replace(/_/g, " ")}
          </p>
          <h3 className="mt-2 text-xl font-bold tracking-[-0.05em] text-black">
            {project.title}
          </h3>
        </div>
        <span className="rounded-full border border-[#3F6212]/18 bg-[#3F6212]/8 px-3 py-1 text-xs font-bold text-[#365314]">
          {formatBudget(project.budget)}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-black/58">
        {project.description}
      </p>

      <div className="mt-5 grid gap-2 rounded-[1.2rem] border border-[#3F6212]/12 bg-[#fefce8] p-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-black/48">Client</span>
          <strong className="truncate text-black">{getPersonName(project.client, "You")}</strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-black/48">Provider</span>
          <strong className="truncate text-black">
            {getPersonName(project.provider, "Not assigned")}
          </strong>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-black/48">Deadline</span>
          <strong className="text-black">{formatDeadline(project.deadline)}</strong>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {["open", "in_progress", "completed"].map((status) => (
          <button
            className={`rounded-full border px-3 py-2 text-xs font-bold capitalize transition ${
              project.status === status
                ? "border-[#3F6212] bg-[#3F6212] text-white shadow-[0_12px_30px_rgba(63, 98, 18, 0.2)]"
                : "border-black/10 bg-white text-black/58 hover:border-[#3F6212] hover:bg-[#3F6212] hover:text-white"
            }`}
            disabled={isUpdating || project.status === status}
            key={status}
            onClick={() => onStatusChange(project._id, status)}
            type="button"
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </article>
  );
}

export function Projects() {
  const [form, setForm] = useState(initialProjectForm);
  const [message, setMessage] = useState("");
  const queryClient = useQueryClient();
  const {
    data: projects = [],
    error,
    isError,
    isLoading,
  } = useQuery({
    queryFn: () => getProjects(),
    queryKey: ["projects"],
    staleTime: 10_000,
  });
  const groupedProjects = useMemo(
    () =>
      statusColumns.reduce((groups, column) => {
        groups[column.status] = projects.filter((project) => project.status === column.status);
        return groups;
      }, {}),
    [projects],
  );
  const cancelledProjects = projects.filter((project) => project.status === "cancelled");
  const createMutation = useMutation({
    mutationFn: createProject,
    onError: (mutationError) => {
      setMessage(mutationError.message ?? "Unable to create project.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setForm(initialProjectForm);
      setMessage("Project created.");
    },
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => updateProject(id, { status }),
    onError: (mutationError) => {
      setMessage(mutationError.message ?? "Unable to update project.");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      setMessage("Project status updated.");
    },
  });

  function updateForm(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function submitProject(event) {
    event.preventDefault();
    createMutation.mutate({
      ...form,
      budget: form.budget ? Number(form.budget) : 0,
      deadline: form.deadline || undefined,
      providerId: form.providerId.trim() || undefined,
    });
  }

  return (
    <SaaSLayout eyebrow="Projects" title="Project control room">
      <div className="grid gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-[#3F6212]/16 bg-[radial-gradient(circle_at_92%_10%,rgba(63, 98, 18, 0.18),transparent_30%),linear-gradient(135deg,#ffffff,#fefce8)] p-6 shadow-[0_28px_90px_rgba(63, 98, 18, 0.1)] md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_410px] xl:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3F6212]">
                Delivery workspace
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-[-0.07em] text-black md:text-6xl">
                Keep client work, providers, payment context, and status in one view.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-black/58">
                Create scopes, attach providers, track progress, and move work from open request to completed delivery.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_20px_65px_rgba(63, 98, 18, 0.08)]">
              {statusColumns.map((column) => (
                <div className="rounded-2xl bg-[#fefce8] px-4 py-4" key={column.status}>
                  <div className={`h-2 w-8 rounded-full ${column.accent}`} />
                  <strong className="mt-4 block text-3xl tracking-[-0.06em] text-black">
                    {groupedProjects[column.status]?.length ?? 0}
                  </strong>
                  <span className="mt-1 block text-xs font-bold uppercase tracking-[0.14em] text-black/42">
                    {column.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {message ? (
          <StatusBanner tone={message.includes("Unable") ? "error" : "success"}>
            {message}
          </StatusBanner>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[410px_minmax(0,1fr)]">
          <form
            className="h-fit rounded-[2rem] border border-[#3F6212]/14 bg-white p-5 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] md:p-6"
            onSubmit={submitProject}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3F6212]">
              New project
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.055em] text-black">
              Add a delivery scope
            </h2>
            <div className="mt-5 grid gap-3">
              <input
                className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                name="title"
                onChange={updateForm}
                placeholder="Project title"
                required
                value={form.title}
              />
              <textarea
                className="min-h-28 rounded-[1.25rem] border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                name="description"
                onChange={updateForm}
                placeholder="Scope, outcome, success criteria"
                required
                value={form.description}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  min="0"
                  name="budget"
                  onChange={updateForm}
                  placeholder="Budget"
                  type="number"
                  value={form.budget}
                />
                <input
                  className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                  name="deadline"
                  onChange={updateForm}
                  type="date"
                  value={form.deadline}
                />
              </div>
              <input
                className="rounded-2xl border border-black/10 bg-[#fefce8] px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/32 focus:border-[#3F6212]/45 focus:ring-4 focus:ring-[#3F6212]/10"
                name="providerId"
                onChange={updateForm}
                placeholder="Provider ID optional"
                value={form.providerId}
              />
              <Button
                className="mt-2"
                isLoading={createMutation.isPending}
                loadingLabel="Creating..."
                type="submit"
              >
                Create Project
              </Button>
            </div>
          </form>

          <section className="grid gap-4">
            {isError ? (
              <StatusBanner tone="error">
                {error?.message ?? "Unable to load projects."}
              </StatusBanner>
            ) : null}
            {isLoading ? <LoadingState columns={3} /> : null}
            {!isLoading && projects.length === 0 ? (
              <EmptyState
                description="Projects you create or participate in will appear here with status, provider, deadline, and budget context."
                title="No projects yet"
              />
            ) : null}
            {!isLoading && projects.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-3">
                {statusColumns.map((column) => (
                  <div className="grid content-start gap-3" key={column.status}>
                    <div className="rounded-[1.4rem] border border-[#3F6212]/14 bg-white p-4 shadow-[0_18px_55px_rgba(63, 98, 18, 0.06)]">
                      <div className={`h-2 w-10 rounded-full ${column.accent}`} />
                      <h2 className="mt-4 text-2xl font-bold tracking-[-0.055em] text-black">
                        {column.label}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-black/52">{column.description}</p>
                    </div>
                    {(groupedProjects[column.status] ?? []).map((project) => (
                      <ProjectCard
                        isUpdating={updateMutation.isPending}
                        key={project._id}
                        onStatusChange={(id, status) => updateMutation.mutate({ id, status })}
                        project={project}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
            {cancelledProjects.length > 0 ? (
              <div className="rounded-[1.5rem] border border-black/10 bg-white p-5 shadow-[0_18px_55px_rgba(63, 98, 18, 0.06)]">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/42">
                  Cancelled
                </p>
                <p className="mt-2 text-sm text-black/58">
                  {cancelledProjects.length} cancelled project
                  {cancelledProjects.length === 1 ? "" : "s"} hidden from the main board.
                </p>
              </div>
            ) : null}
          </section>
        </div>
      </div>
    </SaaSLayout>
  );
}
