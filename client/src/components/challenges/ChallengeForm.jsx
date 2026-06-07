import { Save } from "lucide-react";
import {
  CHALLENGE_BUDGET_OPTIONS,
  CHALLENGE_CATEGORY_OPTIONS,
  CHALLENGE_CURRENCY_OPTIONS,
  CHALLENGE_HIRING_URGENCY_OPTIONS,
  CHALLENGE_TIMELINE_OPTIONS,
  CHALLENGE_URGENCY_OPTIONS,
  CHALLENGE_VISIBILITY_OPTIONS,
} from "../../features/challenges/challengeUtils.js";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { ChallengeMilestoneTemplateEditor } from "./ChallengeMilestoneTemplateEditor.jsx";
import { ProofRequirementsEditor } from "./ProofRequirementsEditor.jsx";
import { SuccessCriteriaEditor } from "./SuccessCriteriaEditor.jsx";

function Section({ children, description, title }) {
  return (
    <section className="grid gap-5 rounded-3xl border border-[#E9E2F3] bg-white p-4 shadow-[0_16px_50px_rgba(31,14,54,0.05)] sm:p-6">
      <div>
        <h2 className="text-xl font-black text-[#07030D]">{title}</h2>
        {description ? <p className="mt-1 text-sm leading-6 text-[#6F657C]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function ChallengeForm({
  challengeStatus = "draft",
  errors = {},
  form,
  isArchiving = false,
  isClosing = false,
  isPausing = false,
  isPublishing = false,
  isSubmitting = false,
  mode = "create",
  onArchive,
  onCancel,
  onChange,
  onClose,
  onPause,
  onPublish,
  onSubmit,
}) {
  function setField(field, value) {
    onChange({ ...form, [field]: value });
  }

  function setNested(section, field, value) {
    onChange({
      ...form,
      [section]: {
        ...form[section],
        [field]: value,
      },
    });
  }

  const canPause = ["open", "reviewing_plans"].includes(challengeStatus);
  const canClose = mode === "edit" && !["archived", "cancelled", "completed"].includes(challengeStatus);
  const canArchive = mode === "edit" && challengeStatus !== "archived";

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <Section
        description="Name the measurable result, the type of provider you need, and the business context."
        title="Basic challenge"
      >
        <Input
          error={errors.title}
          label="Title"
          onChange={(event) => setField("title", event.target.value)}
          placeholder="Clean 500 leads and upload them into CRM weekly"
          required
          value={form.title}
        />
        <Textarea
          error={errors.shortSummary}
          label="Short summary"
          maxLength={280}
          onChange={(event) => setField("shortSummary", event.target.value)}
          placeholder="Need verified leads cleaned, deduplicated, tagged, and uploaded with weekly proof reports."
          required
          rows={3}
          value={form.shortSummary}
        />
        <Textarea
          error={errors.description}
          label="Description"
          onChange={(event) => setField("description", event.target.value)}
          placeholder="Explain the current problem, what needs to be delivered, how providers should approach the work, and what proof you expect."
          required
          rows={7}
          value={form.description}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            error={errors.category}
            label="Category"
            onChange={(event) => setField("category", event.target.value)}
            options={CHALLENGE_CATEGORY_OPTIONS}
            placeholder=""
            required
            value={form.category}
          />
          <Input
            label="Sub-category"
            onChange={(event) => setField("subCategory", event.target.value)}
            placeholder="CRM lead cleanup"
            value={form.subCategory}
          />
          <Input
            label="Industry"
            onChange={(event) => setField("industry", event.target.value)}
            placeholder="Real Estate"
            value={form.industry}
          />
          <Input
            label="Target provider type"
            onChange={(event) => setField("targetProviderType", event.target.value)}
            placeholder="Lead generation VA, CRM specialist, operations assistant"
            value={form.targetProviderType}
          />
        </div>
      </Section>

      <Section
        description="Make the desired result measurable so providers can submit specific execution plans."
        title="Target outcome"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            error={errors.metricName}
            label="Metric name"
            onChange={(event) => setNested("targetOutcome", "metricName", event.target.value)}
            placeholder="Cleaned CRM leads"
            required
            value={form.targetOutcome.metricName}
          />
          <Input
            error={errors.targetValue}
            label="Target value"
            onChange={(event) => setNested("targetOutcome", "targetValue", event.target.value)}
            placeholder="500"
            required
            value={form.targetOutcome.targetValue}
          />
          <Input
            label="Unit"
            onChange={(event) => setNested("targetOutcome", "unit", event.target.value)}
            placeholder="leads per week"
            value={form.targetOutcome.unit}
          />
        </div>
        <Textarea
          error={errors.outcomeStatement}
          label="Outcome statement"
          onChange={(event) => setNested("targetOutcome", "outcomeStatement", event.target.value)}
          placeholder="Clean 500 leads weekly and upload them into CRM with verified contact details and status tags."
          required
          rows={3}
          value={form.targetOutcome.outcomeStatement}
        />
      </Section>

      <Section title="Success criteria">
        <SuccessCriteriaEditor
          error={errors.successCriteria}
          items={form.successCriteria}
          onChange={(items) => setField("successCriteria", items)}
        />
      </Section>

      <Section title="Proof requirements">
        <ProofRequirementsEditor
          error={errors.proofRequirements}
          items={form.proofRequirements}
          onChange={(items) => setField("proofRequirements", items)}
        />
      </Section>

      <Section
        description="Set when work should happen and how providers should interpret the budget."
        title="Timeline and budget"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Timeline type"
            onChange={(event) => setNested("timeline", "type", event.target.value)}
            options={CHALLENGE_TIMELINE_OPTIONS}
            placeholder=""
            value={form.timeline.type}
          />
          {form.timeline.type === "fixed_deadline" ? (
            <>
              <Input
                label="Start date"
                onChange={(event) => setNested("timeline", "startDate", event.target.value)}
                type="date"
                value={form.timeline.startDate}
              />
              <Input
                error={errors.endDate}
                label="End date"
                onChange={(event) => setNested("timeline", "endDate", event.target.value)}
                type="date"
                value={form.timeline.endDate}
              />
            </>
          ) : null}
          {form.timeline.type === "duration_days" ? (
            <Input
              label="Duration days"
              min="1"
              onChange={(event) => setNested("timeline", "durationDays", event.target.value)}
              placeholder="30"
              type="number"
              value={form.timeline.durationDays}
            />
          ) : null}
          {form.timeline.type === "range_days" ? (
            <>
              <Input
                label="Minimum days"
                min="1"
                onChange={(event) => setNested("timeline", "minDays", event.target.value)}
                placeholder="14"
                type="number"
                value={form.timeline.minDays}
              />
              <Input
                error={errors.maxDays}
                label="Maximum days"
                min="1"
                onChange={(event) => setNested("timeline", "maxDays", event.target.value)}
                placeholder="30"
                type="number"
                value={form.timeline.maxDays}
              />
            </>
          ) : null}
          {form.timeline.type === "custom" ? (
            <Input
              label="Custom timeline label"
              onChange={(event) => setNested("timeline", "customLabel", event.target.value)}
              placeholder="Scoped after provider plan review"
              value={form.timeline.customLabel}
            />
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Budget type"
            onChange={(event) => setNested("budget", "type", event.target.value)}
            options={CHALLENGE_BUDGET_OPTIONS}
            placeholder=""
            value={form.budget.type}
          />
          <Select
            label="Currency"
            onChange={(event) => setNested("budget", "currency", event.target.value)}
            options={CHALLENGE_CURRENCY_OPTIONS}
            placeholder=""
            value={form.budget.currency}
          />
          {["fixed", "range", "milestone", "hourly"].includes(form.budget.type) ? (
            <Input
              error={errors.budgetMin}
              label={form.budget.type === "range" ? "Minimum budget" : "Budget"}
              min="0"
              onChange={(event) => setNested("budget", "min", event.target.value)}
              placeholder="500"
              type="number"
              value={form.budget.min}
            />
          ) : null}
          {form.budget.type === "range" ? (
            <Input
              error={errors.budgetMax}
              label="Maximum budget"
              min="0"
              onChange={(event) => setNested("budget", "max", event.target.value)}
              placeholder="1000"
              type="number"
              value={form.budget.max}
            />
          ) : null}
          {["hidden", "negotiable"].includes(form.budget.type) ? (
            <Input
              label="Budget note"
              onChange={(event) => setNested("budget", "customLabel", event.target.value)}
              placeholder="Budget to be finalized after plan review"
              value={form.budget.customLabel}
            />
          ) : null}
        </div>
      </Section>

      <Section title="Milestone template">
        <ChallengeMilestoneTemplateEditor
          items={form.milestoneTemplate}
          onChange={(items) => setField("milestoneTemplate", items)}
        />
      </Section>

      <Section
        description="Use comma-separated terms. These will support future matching and provider discovery."
        title="Skills, tools, industries, and tags"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Skills needed"
            onChange={(event) => setField("skillsNeededText", event.target.value)}
            placeholder="CRM, Data Cleaning, Lead Verification"
            rows={3}
            value={form.skillsNeededText}
          />
          <Textarea
            label="Tools needed"
            onChange={(event) => setField("toolsNeededText", event.target.value)}
            placeholder="HubSpot, Google Sheets, Airtable"
            rows={3}
            value={form.toolsNeededText}
          />
          <Textarea
            label="Industries"
            onChange={(event) => setField("industriesText", event.target.value)}
            placeholder="Real Estate, SaaS, Cleaning"
            rows={3}
            value={form.industriesText}
          />
          <Textarea
            label="Tags"
            onChange={(event) => setField("tagsText", event.target.value)}
            placeholder="crm cleanup, lead verification, weekly proof"
            rows={3}
            value={form.tagsText}
          />
        </div>
      </Section>

      <Section title="Location, urgency, and intent">
        <Checkbox
          checked={Boolean(form.location.remote)}
          label="Remote work is allowed"
          onChange={(event) => setNested("location", "remote", event.target.checked)}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Country"
            onChange={(event) => setNested("location", "country", event.target.value)}
            placeholder="United States"
            value={form.location.country}
          />
          <Input
            label="City"
            onChange={(event) => setNested("location", "city", event.target.value)}
            placeholder="Remote"
            value={form.location.city}
          />
          <Input
            label="Timezone"
            onChange={(event) => setNested("location", "timezone", event.target.value)}
            placeholder="EST, PKT, UTC"
            value={form.location.timezone}
          />
          <Select
            label="Urgency"
            onChange={(event) => setField("urgency", event.target.value)}
            options={CHALLENGE_URGENCY_OPTIONS}
            placeholder=""
            value={form.urgency}
          />
          <Select
            label="Hiring urgency"
            onChange={(event) => setNested("clientIntent", "hiringUrgency", event.target.value)}
            options={CHALLENGE_HIRING_URGENCY_OPTIONS}
            placeholder=""
            value={form.clientIntent.hiringUrgency}
          />
          <Input
            label="Response expectation"
            onChange={(event) => setNested("clientIntent", "responseExpectation", event.target.value)}
            placeholder="Review plans within 48 hours"
            value={form.clientIntent.responseExpectation}
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Checkbox
            checked={Boolean(form.clientIntent.budgetConfirmed)}
            label="Budget confirmed"
            onChange={(event) => setNested("clientIntent", "budgetConfirmed", event.target.checked)}
          />
          <Checkbox
            checked={Boolean(form.clientIntent.decisionMakerConfirmed)}
            label="Decision maker confirmed"
            onChange={(event) => setNested("clientIntent", "decisionMakerConfirmed", event.target.checked)}
          />
        </div>
      </Section>

      <Section title="Visibility">
        <Select
          label="Challenge visibility"
          onChange={(event) => setField("visibility", event.target.value)}
          options={CHALLENGE_VISIBILITY_OPTIONS}
          placeholder=""
          value={form.visibility}
        />
      </Section>

      {errors.form ? (
        <p className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-bold text-[#DC2626]" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-3xl border border-[#E9E2F3] bg-white/95 p-3 shadow-[0_24px_80px_rgba(31,14,54,0.16)] backdrop-blur sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <Button isLoading={isSubmitting} loadingLabel="Saving..." type="submit">
            <Save aria-hidden="true" className="mr-2 h-4 w-4" />
            {mode === "create" ? "Save Draft" : "Save Changes"}
          </Button>
          <Button
            isLoading={isPublishing}
            loadingLabel="Publishing..."
            onClick={onPublish}
            type="button"
            variant="outline"
          >
            Publish
          </Button>
          {canPause ? (
            <Button isLoading={isPausing} loadingLabel="Pausing..." onClick={onPause} type="button" variant="secondary">
              Pause
            </Button>
          ) : null}
          {canClose ? (
            <Button isLoading={isClosing} loadingLabel="Closing..." onClick={onClose} type="button" variant="secondary">
              Close
            </Button>
          ) : null}
          {canArchive ? (
            <Button isLoading={isArchiving} loadingLabel="Archiving..." onClick={onArchive} type="button" variant="secondary">
              Archive
            </Button>
          ) : null}
        </div>
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
