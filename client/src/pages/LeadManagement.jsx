import { useMemo, useState } from "react";
import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import {
  useCreateMyLead,
  useDeleteMyLead,
  useImportMyLeads,
  useUpdateMyLead,
} from "../hooks/useLeadMutations.js";
import {
  useLeadScrapeJobs,
  useStartLeadScrape,
} from "../hooks/useLeadScraper.js";
import { useMyLeads } from "../hooks/useMyLeads.js";
import {
  useCreateEmailTemplate,
  useDeleteEmailTemplate,
  useEmailTemplates,
  useOutreachEmails,
  useOutreachJobs,
  useSendOutreachEmail,
  useStartOutreachAutomation,
} from "../hooks/useOutreach.js";
import { formatDate } from "../utils/index.js";

const emptyLeadForm = {
  company: "",
  email: "",
  name: "",
  phone: "",
  status: "new",
};

const leadStatuses = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Qualified", value: "qualified" },
  { label: "Closed", value: "closed" },
  { label: "Lost", value: "lost" },
];

const statusClasses = {
  closed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  contacted: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  new: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  qualified: "border-lime-300/20 bg-lime-300/10 text-lime-100",
  lost: "border-rose-300/20 bg-rose-300/10 text-rose-100",
};

const scrapeStatusClasses = {
  completed: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  failed: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  pending: "border-amber-300/20 bg-amber-300/10 text-amber-100",
  queued: "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
  running: "border-sky-300/20 bg-sky-300/10 text-sky-100",
};

const emailStatusClasses = {
  failed: "border-rose-300/20 bg-rose-300/10 text-rose-100",
  queued: "border-sky-300/20 bg-sky-300/10 text-sky-100",
  sent: "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
  skipped: "border-amber-300/20 bg-amber-300/10 text-amber-100",
};
const leadsTablePageSize = 8;

function getLeadSortValue(lead, key) {
  if (key === "createdAt") {
    return new Date(lead.createdAt ?? 0).getTime();
  }

  return String(lead[key] ?? "").toLowerCase();
}

function normalizeLeadStatus(status) {
  if (status === "converted") {
    return "closed";
  }

  return status || "new";
}

function getErrorMessage(error, fallback) {
  return error?.message ?? fallback;
}

function parseCsvLine(line) {
  const values = [];
  let currentValue = "";
  let isQuoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    const nextCharacter = line[index + 1];

    if (character === '"' && nextCharacter === '"') {
      currentValue += '"';
      index += 1;
      continue;
    }

    if (character === '"') {
      isQuoted = !isQuoted;
      continue;
    }

    if (character === "," && !isQuoted) {
      values.push(currentValue.trim());
      currentValue = "";
      continue;
    }

    currentValue += character;
  }

  values.push(currentValue.trim());
  return values;
}

function parseCsvLeads(csvText) {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error("CSV must include a header row and at least one lead.");
  }

  const headers = parseCsvLine(lines[0]).map((header) =>
    header.toLowerCase().replace(/\s+/g, ""),
  );
  const allowedFields = new Set(["name", "email", "phone", "company", "status"]);

  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    const lead = {};

    headers.forEach((header, index) => {
      if (allowedFields.has(header)) {
        lead[header] = values[index] ?? "";
      }
    });

    return lead;
  });
}

function LeadField({ label, name, onChange, placeholder, type = "text", value }) {
  return (
    <label className="text-sm font-semibold text-slate-200">
      {label}
      <input
        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
    </label>
  );
}

function getFormFromLead(lead) {
  if (!lead) {
    return emptyLeadForm;
  }

  return {
    company: lead.company ?? "",
    email: lead.email ?? "",
    name: lead.name ?? "",
    phone: lead.phone ?? "",
    status: normalizeLeadStatus(lead.status),
  };
}

function LeadForm({ editingLead, onCancelEdit }) {
  const [form, setForm] = useState(() => getFormFromLead(editingLead));
  const [message, setMessage] = useState("");
  const createLeadMutation = useCreateMyLead();
  const updateLeadMutation = useUpdateMyLead();
  const isEditing = Boolean(editingLead);
  const isSubmitting = createLeadMutation.isPending || updateLeadMutation.isPending;

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      setMessage("Name and email are required.");
      return;
    }

    try {
      if (isEditing) {
        await updateLeadMutation.mutateAsync({
          id: editingLead._id,
          leadData: form,
        });
        setMessage("Lead updated.");
        onCancelEdit();
        return;
      }

      await createLeadMutation.mutateAsync(form);
      setForm(emptyLeadForm);
      setMessage("Lead added.");
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to save lead."));
    }
  }

  return (
    <form
      className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            {isEditing ? "Edit Lead" : "Manual Entry"}
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            {isEditing ? "Update lead details" : "Add a new lead"}
          </h2>
        </div>
        {isEditing ? (
          <Button onClick={onCancelEdit} type="button" variant="secondary">
            Cancel
          </Button>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <LeadField
          label="Name"
          name="name"
          onChange={updateField}
          placeholder="Alex Morgan"
          value={form.name}
        />
        <LeadField
          label="Email"
          name="email"
          onChange={updateField}
          placeholder="alex@company.com"
          type="email"
          value={form.email}
        />
        <LeadField
          label="Phone"
          name="phone"
          onChange={updateField}
          placeholder="+1 555 0100"
          value={form.phone}
        />
        <LeadField
          label="Company"
          name="company"
          onChange={updateField}
          placeholder="Acme Inc."
          value={form.company}
        />
        <label className="text-sm font-semibold text-slate-200 sm:col-span-2">
          Status
          <select
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
            name="status"
            onChange={updateField}
            value={form.status}
          >
            {leadStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {message ? <StatusBanner className="mt-5">{message}</StatusBanner> : null}

      <Button
        className="mt-6 w-full"
        isLoading={isSubmitting}
        loadingLabel={isEditing ? "Updating lead..." : "Adding lead..."}
        type="submit"
      >
        {isEditing ? "Update Lead" : "Add Lead"}
      </Button>
    </form>
  );
}

function CsvImportPanel() {
  const [csvText, setCsvText] = useState("");
  const [message, setMessage] = useState("");
  const importMutation = useImportMyLeads();

  function updateFile(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""));
      setMessage("");
    };
    reader.readAsText(file);
  }

  async function handleImport(event) {
    event.preventDefault();

    try {
      const leads = parseCsvLeads(csvText);
      const response = await importMutation.mutateAsync(leads);

      setCsvText("");
      setMessage(`${response.count ?? leads.length} leads imported.`);
    } catch (error) {
      setMessage(getErrorMessage(error, "Unable to import leads."));
    }
  }

  return (
    <form
      className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
      onSubmit={handleImport}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
        CSV Import
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">Import leads in bulk</h2>
      <p className="mt-3 text-sm leading-6 text-slate-400">
        Use headers: name, email, phone, company, status.
      </p>

      <input
        accept=".csv,text/csv"
        className="mt-5 w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/60 px-4 py-4 text-sm text-slate-300 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-300 file:px-4 file:py-2 file:text-sm file:font-bold file:text-slate-950"
        onChange={updateFile}
        type="file"
      />
      <textarea
        className="mt-4 min-h-36 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
        onChange={(event) => {
          setCsvText(event.target.value);
          setMessage("");
        }}
        placeholder={"name,email,phone,company,status\nAlex Morgan,alex@company.com,+1 555 0100,Acme,new"}
        value={csvText}
      />

      {message ? <StatusBanner className="mt-5">{message}</StatusBanner> : null}

      <Button
        className="mt-6 w-full"
        disabled={!csvText.trim()}
        isLoading={importMutation.isPending}
        loadingLabel="Importing leads..."
        type="submit"
      >
        Import CSV
      </Button>
    </form>
  );
}

function LeadScraperPanel() {
  const [keyword, setKeyword] = useState("");
  const [message, setMessage] = useState("");
  const { error, isError, isLoading, jobs } = useLeadScrapeJobs();
  const startScrapeMutation = useStartLeadScrape();

  async function handleSubmit(event) {
    event.preventDefault();

    if (keyword.trim().length < 3) {
      setMessage("Enter a keyword with at least 3 characters.");
      return;
    }

    try {
      await startScrapeMutation.mutateAsync(keyword.trim());
      setKeyword("");
      setMessage("Scrape job queued. Leads will appear when processing finishes.");
    } catch (requestError) {
      setMessage(getErrorMessage(requestError, "Unable to start scrape job."));
    }
  }

  return (
    <form
      className="min-w-0 overflow-hidden rounded-3xl border border-[#65A30D]/18 bg-[linear-gradient(145deg,rgba(63, 98, 18, 0.16),rgba(255,255,255,0.055)_42%,rgba(0,0,0,0.22))] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
      onSubmit={handleSubmit}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
        Lead Scraper
      </p>
      <h2 className="mt-2 text-2xl font-bold text-white">Find leads by keyword</h2>
      <p className="mt-3 text-sm leading-6 text-white/62">
        Search public sources and save basic company records to your pipeline.
      </p>

      <div className="mt-5 grid min-w-0 gap-3">
        <input
          className="min-h-12 min-w-0 rounded-2xl border border-white/10 bg-[#1C1917]/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
          onChange={(event) => {
            setKeyword(event.target.value);
            setMessage("");
          }}
          placeholder="real estate USA"
          value={keyword}
        />
        <Button
          className="w-full whitespace-nowrap"
          disabled={!keyword.trim()}
          isLoading={startScrapeMutation.isPending}
          loadingLabel="Queueing..."
          type="submit"
        >
          Start Scrape
        </Button>
      </div>

      {message ? <StatusBanner className="mt-5">{message}</StatusBanner> : null}
      {isError ? (
        <StatusBanner className="mt-5" tone="error">
          {error}
        </StatusBanner>
      ) : null}

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-400">
            Recent jobs
          </h3>
          {isLoading ? <span className="text-xs text-slate-500">Loading...</span> : null}
        </div>
        <div className="mt-3 grid gap-3">
          {!isLoading && jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#1C1917]/55 px-4 py-6 text-sm text-white/48">
              No scrape jobs yet.
            </div>
          ) : null}
          {jobs.slice(0, 4).map((job) => (
            <div
              className="min-w-0 rounded-2xl border border-white/10 bg-[#1C1917]/70 p-4"
              key={job._id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-bold text-white">{job.keyword}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Found {job.discoveredCount} / saved {job.savedCount}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${scrapeStatusClasses[job.status] ?? scrapeStatusClasses.queued}`}
                >
                  {job.status}
                </span>
              </div>
              {job.errorMessage ? (
                <p className="mt-3 text-xs leading-5 text-rose-200">
                  {job.errorMessage}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}

function OutreachPanel({ leads }) {
  const [automationStatus, setAutomationStatus] = useState("new");
  const [leadId, setLeadId] = useState("");
  const [message, setMessage] = useState("");
  const [templateForm, setTemplateForm] = useState({
    body: "Hi {{name}},\n\nI wanted to reach out about {{company}} and see if improving lead flow is a priority right now.\n\nOpen to a quick call this week?\n\nBest,\nScaleOps",
    name: "",
    subject: "Quick idea for {{company}}",
  });
  const [templateId, setTemplateId] = useState("");
  const { emails } = useOutreachEmails();
  const { jobs } = useOutreachJobs();
  const { isError, isLoading, templates, error } = useEmailTemplates();
  const createTemplateMutation = useCreateEmailTemplate();
  const deleteTemplateMutation = useDeleteEmailTemplate();
  const sendEmailMutation = useSendOutreachEmail();
  const startAutomationMutation = useStartOutreachAutomation();
  const leadsWithEmail = leads.filter((lead) => lead.email);
  const activeTemplateId = templateId || templates[0]?._id || "";
  const activeLeadId = leadId || leadsWithEmail[0]?._id || "";

  function updateTemplateField(event) {
    const { name, value } = event.target;
    setTemplateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setMessage("");
  }

  async function handleCreateTemplate(event) {
    event.preventDefault();

    if (!templateForm.name.trim()) {
      setMessage("Template name is required.");
      return;
    }

    try {
      const template = await createTemplateMutation.mutateAsync(templateForm);
      setTemplateId(template._id);
      setTemplateForm({
        body: "",
        name: "",
        subject: "Quick idea for {{company}}",
      });
      setMessage("Template saved.");
    } catch (requestError) {
      setMessage(getErrorMessage(requestError, "Unable to save template."));
    }
  }

  async function handleSendEmail(event) {
    event.preventDefault();

    if (!activeLeadId || !activeTemplateId) {
      setMessage("Choose a lead and template first.");
      return;
    }

    try {
      const email = await sendEmailMutation.mutateAsync({
        leadId: activeLeadId,
        templateId: activeTemplateId,
      });
      setMessage(
        email.status === "sent"
          ? "Email sent and tracked."
          : `Email tracked as ${email.status}. ${email.errorMessage ?? ""}`.trim(),
      );
    } catch (requestError) {
      setMessage(getErrorMessage(requestError, "Unable to send email."));
    }
  }

  async function handleStartAutomation(event) {
    event.preventDefault();

    if (!activeTemplateId) {
      setMessage("Choose a template before starting automation.");
      return;
    }

    try {
      await startAutomationMutation.mutateAsync({
        statusFilter: automationStatus,
        templateId: activeTemplateId,
      });
      setMessage("Automation queued. Sent emails will appear in history.");
    } catch (requestError) {
      setMessage(getErrorMessage(requestError, "Unable to start automation."));
    }
  }

  async function handleDeleteTemplate() {
    if (!activeTemplateId) {
      return;
    }

    const shouldDelete = window.confirm("Delete this template?");

    if (!shouldDelete) {
      return;
    }

    await deleteTemplateMutation.mutateAsync(activeTemplateId);
    setTemplateId("");
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Outreach
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Send emails and automate follow-up
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Use templates with merge tags like {"{{name}}"} and {"{{company}}"}.
          </p>
        </div>
        {isLoading ? <span className="text-sm text-slate-500">Loading templates...</span> : null}
      </div>

      {isError ? (
        <StatusBanner className="mt-5" tone="error">
          {error}
        </StatusBanner>
      ) : null}
      {message ? <StatusBanner className="mt-5">{message}</StatusBanner> : null}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
        <form className="rounded-2xl border border-white/10 bg-slate-950/45 p-5" onSubmit={handleCreateTemplate}>
          <h3 className="text-lg font-bold text-white">Template builder</h3>
          <div className="mt-4 grid gap-4">
            <LeadField
              label="Template name"
              name="name"
              onChange={updateTemplateField}
              placeholder="Initial outreach"
              value={templateForm.name}
            />
            <LeadField
              label="Subject"
              name="subject"
              onChange={updateTemplateField}
              placeholder="Quick idea for {{company}}"
              value={templateForm.subject}
            />
            <label className="text-sm font-semibold text-slate-200">
              Body
              <textarea
                className="mt-2 min-h-40 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                name="body"
                onChange={updateTemplateField}
                placeholder="Hi {{name}}, ..."
                value={templateForm.body}
              />
            </label>
          </div>
          <Button
            className="mt-5 w-full"
            isLoading={createTemplateMutation.isPending}
            loadingLabel="Saving..."
            type="submit"
          >
            Save Template
          </Button>
        </form>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
          <h3 className="text-lg font-bold text-white">Send email</h3>
          <form className="mt-4 grid gap-4" onSubmit={handleSendEmail}>
            <label className="text-sm font-semibold text-slate-200">
              Template
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => setTemplateId(event.target.value)}
                value={activeTemplateId}
              >
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold text-slate-200">
              Lead
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => setLeadId(event.target.value)}
                value={activeLeadId}
              >
                {leadsWithEmail.map((lead) => (
                  <option key={lead._id} value={lead._id}>
                    {lead.name} - {lead.email}
                  </option>
                ))}
              </select>
            </label>
            <Button
              disabled={!activeLeadId || !activeTemplateId}
              isLoading={sendEmailMutation.isPending}
              loadingLabel="Sending..."
              type="submit"
            >
              Send Email
            </Button>
            <Button
              disabled={!activeTemplateId}
              isLoading={deleteTemplateMutation.isPending}
              loadingLabel="Deleting..."
              onClick={handleDeleteTemplate}
              type="button"
              variant="secondary"
            >
              Delete Selected Template
            </Button>
          </form>

          <form className="mt-6 border-t border-white/10 pt-5" onSubmit={handleStartAutomation}>
            <h3 className="text-lg font-bold text-white">Basic automation</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Queue emails to every lead in a pipeline status.
            </p>
            <label className="mt-4 block text-sm font-semibold text-slate-200">
              Status
              <select
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => setAutomationStatus(event.target.value)}
                value={automationStatus}
              >
                <option value="all">All</option>
                {leadStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <Button
              className="mt-4 w-full"
              disabled={!activeTemplateId}
              isLoading={startAutomationMutation.isPending}
              loadingLabel="Queueing..."
              type="submit"
              variant="outline"
            >
              Start Automation
            </Button>
          </form>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-5">
          <h3 className="text-lg font-bold text-white">Sent email history</h3>
          <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
            {emails.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 px-4 py-8 text-sm text-slate-500">
                No tracked outreach yet.
              </div>
            ) : null}
            {emails.slice(0, 8).map((email) => (
              <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4" key={email._id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-white">{email.subject}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {email.leadId?.name ?? email.to} - {email.to}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${emailStatusClasses[email.status] ?? emailStatusClasses.skipped}`}
                  >
                    {email.status}
                  </span>
                </div>
                {email.errorMessage ? (
                  <p className="mt-3 text-xs leading-5 text-amber-200">
                    {email.errorMessage}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="text-lg font-bold text-white">Automation jobs</h3>
            <div className="mt-3 grid gap-3">
              {jobs.slice(0, 4).map((job) => (
                <div className="rounded-2xl border border-white/10 bg-slate-950/55 p-4" key={job._id}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold capitalize text-white">
                      {job.statusFilter} leads
                    </p>
                    <span className="text-xs font-semibold capitalize text-cyan-200">
                      {job.status}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400">
                    Sent {job.sentCount}, skipped {job.skippedCount}, failed {job.failedCount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusSelect({ disabled = false, lead, onStatusChange }) {
  return (
    <select
      aria-label={`Change status for ${lead.name}`}
      className="w-full rounded-xl border border-white/10 bg-[#1C1917]/80 px-3 py-2 text-sm font-semibold text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
      disabled={disabled}
      onChange={(event) => onStatusChange(lead, event.target.value)}
      value={normalizeLeadStatus(lead.status)}
    >
      {leadStatuses.map((status) => (
        <option key={status.value} value={status.value}>
          {status.label}
        </option>
      ))}
    </select>
  );
}

function PipelineBoard({ isUpdating, leads, onEdit, onStatusChange }) {
  const [draggingLeadId, setDraggingLeadId] = useState("");
  const groupedLeads = useMemo(
    () =>
      leadStatuses.reduce((groups, status) => {
        groups[status.value] = leads.filter(
          (lead) => normalizeLeadStatus(lead.status) === status.value,
        );
        return groups;
      }, {}),
    [leads],
  );

  function handleDragStart(event, leadId) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", leadId);
    setDraggingLeadId(leadId);
  }

  function handleDrop(event, status) {
    event.preventDefault();

    const leadId = event.dataTransfer.getData("text/plain") || draggingLeadId;
    const lead = leads.find((item) => item._id === leadId);

    setDraggingLeadId("");

    if (!lead || normalizeLeadStatus(lead.status) === status) {
      return;
    }

    onStatusChange(lead, status);
  }

  return (
    <section>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
            Pipeline
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Move leads through the sales flow
          </h2>
        </div>
        <p className="text-sm text-slate-400">
          Drag cards between columns or change status directly.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
        {leadStatuses.map((status) => {
          const columnLeads = groupedLeads[status.value] ?? [];

          return (
            <div
              className="min-h-80 min-w-0 rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl transition hover:border-[#65A30D]/30"
              key={status.value}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, status.value)}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{status.label}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {columnLeads.length} leads
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-bold ${statusClasses[status.value]}`}
                >
                  {status.label}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                {columnLeads.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950/35 px-4 py-8 text-center text-sm text-slate-500">
                    Drop leads here
                  </div>
                ) : null}
                {columnLeads.map((lead) => (
                  <div
                    className={`min-w-0 rounded-2xl border border-white/10 bg-[#1C1917]/78 p-4 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:border-[#65A30D]/40 ${draggingLeadId === lead._id ? "opacity-50" : ""}`}
                    draggable
                    key={lead._id}
                    onDragEnd={() => setDraggingLeadId("")}
                    onDragStart={(event) => handleDragStart(event, lead._id)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-bold text-white">{lead.name}</p>
                        <p className="mt-1 break-all text-xs text-slate-400">
                          {lead.email || lead.website || "No email"}
                        </p>
                      </div>
                      <button
                        className="shrink-0 rounded-lg border border-white/10 px-2 py-1 text-xs font-bold text-slate-300 transition hover:border-[#65A30D]/45 hover:text-white"
                        onClick={() => onEdit(lead)}
                        type="button"
                      >
                        Edit
                      </button>
                    </div>
                    <p className="mt-3 text-sm text-slate-300">
                      {lead.company || "No company"}
                    </p>
                    <div className="mt-4">
                      <StatusSelect
                        disabled={isUpdating}
                        lead={lead}
                        onStatusChange={onStatusChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SortHeader({ label, onSort, sortConfig, sortKey }) {
  const isActive = sortConfig.key === sortKey;

  return (
    <button
      className="inline-flex items-center gap-2 font-bold uppercase tracking-[0.16em] text-slate-500 transition hover:text-cyan-200"
      onClick={() => onSort(sortKey)}
      type="button"
    >
      {label}
      <span className="text-[10px]">
        {isActive ? (sortConfig.direction === "asc" ? "ASC" : "DESC") : ""}
      </span>
    </button>
  );
}

function LeadsTable({
  error,
  isError,
  isLoading,
  isUpdating,
  leads,
  onDelete,
  onEdit,
  onSort,
  onStatusChange,
  sortConfig,
}) {
  if (isLoading) {
    return <LoadingState columns={3} />;
  }

  if (isError) {
    return <StatusBanner tone="error">{error}</StatusBanner>;
  }

  if (leads.length === 0) {
    return (
      <EmptyState
        description="Add a lead manually or import a CSV to start managing your pipeline."
        title="No leads yet"
      />
    );
  }

  return (
    <div className="max-w-full overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/20 backdrop-blur-xl">
      <div className="grid gap-3 p-3 md:hidden">
        {leads.map((lead) => (
          <article
            className="min-w-0 rounded-2xl border border-white/10 bg-[#1C1917]/70 p-4 shadow-xl shadow-black/15"
            key={lead._id}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-bold text-white">{lead.name}</p>
                <p className="mt-1 break-all text-xs text-slate-400">
                  {lead.email || lead.website || "No email"}
                </p>
              </div>
              <button
                className="shrink-0 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-200 transition hover:border-[#65A30D]/45 hover:text-white"
                onClick={() => onEdit(lead)}
                type="button"
              >
                Edit
              </button>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="font-bold uppercase tracking-[0.12em] text-slate-500">Phone</p>
                  <p className="mt-1 break-words text-slate-200">{lead.phone || "-"}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                  <p className="font-bold uppercase tracking-[0.12em] text-slate-500">Created</p>
                  <p className="mt-1 text-slate-200">{formatDate(lead.createdAt, { fallback: "-", locale: "en" })}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Company
                </p>
                <p className="mt-1 break-words text-sm text-slate-200">
                  {lead.company || "-"}
                </p>
              </div>
              <StatusSelect
                disabled={isUpdating}
                lead={lead}
                onStatusChange={onStatusChange}
              />
              <Button
                className="min-h-10 border-rose-300/30 px-4 py-2 text-white hover:border-rose-300/70 hover:bg-[#3F6212]"
                onClick={() => onDelete(lead._id)}
                type="button"
                variant="outline"
              >
                Delete Lead
              </Button>
            </div>
          </article>
        ))}
      </div>
      <div className="mobile-scroll-panel hidden md:block">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-white/10 bg-slate-950/70 text-xs uppercase tracking-[0.16em] text-slate-500">
            <tr>
              <th className="px-5 py-4">
                <SortHeader
                  label="Lead"
                  onSort={onSort}
                  sortConfig={sortConfig}
                  sortKey="name"
                />
              </th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">
                <SortHeader
                  label="Company"
                  onSort={onSort}
                  sortConfig={sortConfig}
                  sortKey="company"
                />
              </th>
              <th className="px-5 py-4">
                <SortHeader
                  label="Status"
                  onSort={onSort}
                  sortConfig={sortConfig}
                  sortKey="status"
                />
              </th>
              <th className="px-5 py-4">
                <SortHeader
                  label="Created"
                  onSort={onSort}
                  sortConfig={sortConfig}
                  sortKey="createdAt"
                />
              </th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leads.map((lead) => (
              <tr className="transition hover:bg-white/[0.04]" key={lead._id}>
                <td className="px-5 py-4">
                  <p className="font-bold text-white">{lead.name}</p>
                  <p className="mt-1 max-w-[18rem] break-all text-slate-400">
                    {lead.email || lead.website || "No email"}
                  </p>
                </td>
                <td className="px-5 py-4 text-slate-300">{lead.phone || "-"}</td>
                <td className="px-5 py-4 text-slate-300">{lead.company || "-"}</td>
                <td className="px-5 py-4">
                  <StatusSelect
                    disabled={isUpdating}
                    lead={lead}
                    onStatusChange={onStatusChange}
                  />
                </td>
                <td className="px-5 py-4 text-slate-300">
                  {formatDate(lead.createdAt, { fallback: "-", locale: "en" })}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      className="min-h-9 px-3 py-2"
                      onClick={() => onEdit(lead)}
                      type="button"
                      variant="secondary"
                    >
                      Edit
                    </Button>
                    <Button
                      className="min-h-9 border-rose-300/30 px-3 py-2 text-rose-100 hover:border-rose-300/70 hover:bg-rose-300/10"
                      onClick={() => onDelete(lead._id)}
                      type="button"
                      variant="outline"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeadManagementContent() {
  const [editingLead, setEditingLead] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [tableSort, setTableSort] = useState({
    direction: "desc",
    key: "createdAt",
  });
  const { error, isError, isLoading, leads } = useMyLeads(sortOrder);
  const deleteLeadMutation = useDeleteMyLead();
  const updateLeadMutation = useUpdateMyLead();
  const normalizedLeads = useMemo(
    () =>
      leads.map((lead) => ({
        ...lead,
        status: normalizeLeadStatus(lead.status),
      })),
    [leads],
  );

  const stats = useMemo(
    () => ({
      closed: normalizedLeads.filter((lead) => lead.status === "closed").length,
      open: normalizedLeads.filter((lead) => lead.status !== "closed").length,
      total: normalizedLeads.length,
    }),
    [normalizedLeads],
  );
  const filteredLeads = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return normalizedLeads;
    }

    return normalizedLeads.filter((lead) =>
      [lead.name, lead.email, lead.company, lead.phone, lead.status]
        .some((value) => String(value ?? "").toLowerCase().includes(query)),
    );
  }, [normalizedLeads, searchQuery]);
  const sortedTableLeads = useMemo(() => {
    return [...filteredLeads].sort((firstLead, secondLead) => {
      const firstValue = getLeadSortValue(firstLead, tableSort.key);
      const secondValue = getLeadSortValue(secondLead, tableSort.key);
      const directionMultiplier = tableSort.direction === "asc" ? 1 : -1;

      if (firstValue > secondValue) {
        return directionMultiplier;
      }

      if (firstValue < secondValue) {
        return -directionMultiplier;
      }

      return 0;
    });
  }, [filteredLeads, tableSort]);
  const totalPages = Math.max(1, Math.ceil(sortedTableLeads.length / leadsTablePageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedLeads = sortedTableLeads.slice(
    (safeCurrentPage - 1) * leadsTablePageSize,
    safeCurrentPage * leadsTablePageSize,
  );

  function handleTableSort(key) {
    setTableSort((currentSort) => ({
      direction:
        currentSort.key === key && currentSort.direction === "asc" ? "desc" : "asc",
      key,
    }));
    setCurrentPage(1);
  }

  async function handleDelete(leadId) {
    const shouldDelete = window.confirm("Delete this lead?");

    if (!shouldDelete) {
      return;
    }

    await deleteLeadMutation.mutateAsync(leadId);

    if (editingLead?._id === leadId) {
      setEditingLead(null);
    }
  }

  async function handleStatusChange(lead, status) {
    const nextStatus = normalizeLeadStatus(status);

    if (normalizeLeadStatus(lead.status) === nextStatus) {
      return;
    }

    await updateLeadMutation.mutateAsync({
      id: lead._id,
      leadData: { status: nextStatus },
    });

    if (editingLead?._id === lead._id) {
      setEditingLead((currentLead) => ({
        ...currentLead,
        status: nextStatus,
      }));
    }
  }

  return (
    <Container className="max-w-none px-0 sm:px-0 lg:px-0">
      <div className="grid gap-8">
        <div className="relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-[#65A30D]/18 bg-[linear-gradient(135deg,rgba(63, 98, 18, 0.26),rgba(255,255,255,0.06)_42%,rgba(161,98,7,0.16))] p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-[#65A30D]/20 blur-3xl animate-pulse-glow" />
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Lead Management
            </p>
            <h1 className="mobile-safe-text mt-3 text-3xl font-bold text-white sm:text-5xl">
              Pipeline control center
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              Add, import, update, and clean up leads attached to your account.
            </p>
          </div>
          <div className="relative grid grid-cols-3 gap-2 text-center sm:gap-3">
            {[
              ["Total", stats.total],
              ["Open", stats.open],
              ["Closed", stats.closed],
            ].map(([label, value]) => (
              <div
                className="rounded-2xl border border-white/10 bg-[#1C1917]/68 px-2 py-3 sm:px-4"
                key={label}
              >
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs font-semibold text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(260px,0.82fr)]">
          <LeadForm
            editingLead={editingLead}
            key={editingLead?._id ?? "new-lead"}
            onCancelEdit={() => setEditingLead(null)}
          />
          <CsvImportPanel />
          <LeadScraperPanel />
        </div>

        <OutreachPanel leads={normalizedLeads} />

        <PipelineBoard
          isUpdating={updateLeadMutation.isPending}
          leads={normalizedLeads}
          onEdit={setEditingLead}
          onStatusChange={handleStatusChange}
        />

        <section>
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-cyan-300">
                Lead Table
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                View and manage leads
              </h2>
            </div>
            <div className="grid min-w-0 gap-3 sm:min-w-[360px] sm:grid-cols-[minmax(0,1fr)_auto]">
              <input
                className="min-h-11 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/20"
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search leads..."
                value={searchQuery}
              />
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
                    onClick={() => {
                      setSortOrder(value);
                      setCurrentPage(1);
                    }}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <LeadsTable
            error={error}
            isError={isError}
            isLoading={isLoading}
            isUpdating={updateLeadMutation.isPending}
            leads={paginatedLeads}
            onDelete={handleDelete}
            onEdit={setEditingLead}
            onSort={handleTableSort}
            onStatusChange={handleStatusChange}
            sortConfig={tableSort}
          />
          {!isLoading && !isError && filteredLeads.length > 0 ? (
            <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>
                Showing {(safeCurrentPage - 1) * leadsTablePageSize + 1}-
                {Math.min(safeCurrentPage * leadsTablePageSize, filteredLeads.length)} of{" "}
                {filteredLeads.length}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  className="min-h-10 px-4 py-2"
                  disabled={safeCurrentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  type="button"
                  variant="secondary"
                >
                  Prev
                </Button>
                <span className="px-2 font-bold text-white">
                  {safeCurrentPage} / {totalPages}
                </span>
                <Button
                  className="min-h-10 px-4 py-2"
                  disabled={safeCurrentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => Math.min(totalPages, page + 1))
                  }
                  type="button"
                  variant="secondary"
                >
                  Next
                </Button>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </Container>
  );
}

export function LeadManagement() {
  return (
    <SaaSLayout eyebrow="CRM" title="Leads">
      <LeadManagementContent />
    </SaaSLayout>
  );
}
