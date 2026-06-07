import { Save, Send, XCircle } from "lucide-react";
import {
  PLAN_ATTACHMENT_TYPE_OPTIONS,
  PLAN_CAN_START_OPTIONS,
  PLAN_CURRENCY_OPTIONS,
  PLAN_PRICE_OPTIONS,
  PLAN_TIMELINE_OPTIONS,
} from "../../features/executionPlans/executionPlanUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { CommunicationPlanEditor } from "./CommunicationPlanEditor.jsx";
import { ExecutionPlanMilestonesEditor } from "./ExecutionPlanMilestonesEditor.jsx";
import { ExecutionPlanProofPlanEditor } from "./ExecutionPlanProofPlanEditor.jsx";
import { RiskHandlingEditor } from "./RiskHandlingEditor.jsx";

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

function AttachmentEditor({ items = [], onChange }) {
  const rows = items.length > 0 ? items : [{ note: "", title: "", type: "portfolio", url: "" }];

  function updateItem(index, field, value) {
    onChange(rows.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...rows, { note: "", title: "", type: "portfolio", url: "" }]);
  }

  function removeItem(index) {
    onChange(rows.length === 1 ? [{ note: "", title: "", type: "portfolio", url: "" }] : rows.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-4">
      {rows.map((item, index) => (
        <div className="grid gap-4 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={index}>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Attachment title"
              onChange={(event) => updateItem(index, "title", event.target.value)}
              placeholder="Relevant case study"
              value={item.title}
            />
            <Select
              label="Attachment type"
              onChange={(event) => updateItem(index, "type", event.target.value)}
              options={PLAN_ATTACHMENT_TYPE_OPTIONS}
              placeholder=""
              value={item.type}
            />
          </div>
          <Input
            label="URL"
            onChange={(event) => updateItem(index, "url", event.target.value)}
            placeholder="https://..."
            type="url"
            value={item.url}
          />
          <Textarea
            label="Note"
            onChange={(event) => updateItem(index, "note", event.target.value)}
            placeholder="Explain why this link is relevant."
            rows={2}
            value={item.note}
          />
          <Button
            aria-label={`Remove attachment ${index + 1}`}
            className="w-full sm:w-auto"
            onClick={() => removeItem(index)}
            type="button"
            variant="secondary"
          >
            Remove attachment
          </Button>
        </div>
      ))}
      <Button className="w-full sm:w-auto" onClick={addItem} type="button" variant="outline">
        Add attachment link
      </Button>
    </div>
  );
}

export function ExecutionPlanForm({
  errors = {},
  form,
  isSubmitting = false,
  isWithdrawing = false,
  mode = "create",
  offerOptions = [],
  onCancel,
  onChange,
  onSubmit,
  onWithdraw,
  planStatus = "submitted",
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

  const canWithdraw = mode === "edit" && ["draft", "submitted", "shortlisted", "rejected"].includes(planStatus);

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <Section
        description="Explain what you will do and why the client should trust this plan."
        title="Basic plan"
      >
        <Input
          error={errors.title}
          label="Title"
          onChange={(event) => setField("title", event.target.value)}
          placeholder="CRM lead cleaning and weekly upload execution plan"
          required
          value={form.title}
        />
        <Textarea
          error={errors.summary}
          label="Summary"
          maxLength={500}
          onChange={(event) => setField("summary", event.target.value)}
          placeholder="I will clean, verify, deduplicate, and upload leads weekly with CRM proof and reporting."
          required
          rows={3}
          value={form.summary}
        />
        <Textarea
          error={errors.approach}
          label="Approach"
          onChange={(event) => setField("approach", event.target.value)}
          placeholder="Explain exactly how you will complete the challenge."
          required
          rows={7}
          value={form.approach}
        />
        <Textarea
          label="Why you are a strong match"
          onChange={(event) => setField("whyThisProvider", event.target.value)}
          placeholder="Connect your relevant experience, tools, and proof history to this challenge."
          rows={4}
          value={form.whyThisProvider}
        />
        {mode === "create" ? (
          <Select
            helperText={offerOptions.length === 0 ? "Outcome offers help clients understand repeatable services. You can still submit this plan." : "Optional: connect one of your outcome offers."}
            label="Linked outcome offer"
            onChange={(event) => setField("outcomeOfferId", event.target.value)}
            options={offerOptions}
            placeholder="No linked outcome offer"
            value={form.outcomeOfferId}
          />
        ) : null}
      </Section>

      <Section description="Set a clear delivery window and commercial frame." title="Timeline and price">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            error={errors.timeline}
            label="Timeline type"
            onChange={(event) => setNested("timeline", "type", event.target.value)}
            options={PLAN_TIMELINE_OPTIONS}
            placeholder=""
            required
            value={form.timeline.type}
          />
          {form.timeline.type === "fixed_days" ? (
            <Input
              label="Days"
              min="1"
              onChange={(event) => setNested("timeline", "days", event.target.value)}
              placeholder="14"
              type="number"
              value={form.timeline.days}
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
              label="Custom timeline"
              onChange={(event) => setNested("timeline", "customLabel", event.target.value)}
              placeholder="Scoped after kickoff"
              value={form.timeline.customLabel}
            />
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            error={errors.price}
            label="Price type"
            onChange={(event) => setNested("price", "type", event.target.value)}
            options={PLAN_PRICE_OPTIONS}
            placeholder=""
            required
            value={form.price.type}
          />
          <Select
            label="Currency"
            onChange={(event) => setNested("price", "currency", event.target.value)}
            options={PLAN_CURRENCY_OPTIONS}
            placeholder=""
            value={form.price.currency}
          />
          {form.price.type === "range" ? (
            <>
              <Input
                error={errors.priceMin}
                label="Minimum price"
                min="0"
                onChange={(event) => setNested("price", "min", event.target.value)}
                placeholder="500"
                type="number"
                value={form.price.min}
              />
              <Input
                error={errors.priceMax}
                label="Maximum price"
                min="0"
                onChange={(event) => setNested("price", "max", event.target.value)}
                placeholder="1200"
                type="number"
                value={form.price.max}
              />
            </>
          ) : form.price.type === "custom" ? (
            <Input
              label="Custom price label"
              onChange={(event) => setNested("price", "customLabel", event.target.value)}
              placeholder="Scoped after reviewing sample data"
              value={form.price.customLabel}
            />
          ) : (
            <Input
              error={errors.priceMin}
              label="Price"
              min="0"
              onChange={(event) => setNested("price", "min", event.target.value)}
              placeholder="750"
              type="number"
              value={form.price.min}
            />
          )}
        </div>
      </Section>

      <Section title="Milestones">
        <ExecutionPlanMilestonesEditor
          error={errors.milestones}
          items={form.milestones}
          onChange={(items) => setField("milestones", items)}
        />
      </Section>

      <Section title="Proof plan">
        <ExecutionPlanProofPlanEditor
          error={errors.proofPlan}
          items={form.proofPlan}
          onChange={(items) => setField("proofPlan", items)}
        />
      </Section>

      <Section description="Show the client how you will work and what can go wrong." title="Tools, risks, and communication">
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            helperText="Separate tools with commas."
            label="Tools"
            onChange={(event) => setField("toolsText", event.target.value)}
            placeholder="Google Sheets, HubSpot, Airtable"
            value={form.toolsText}
          />
          <Input
            helperText="Separate skills with commas."
            label="Skills"
            onChange={(event) => setField("skillsText", event.target.value)}
            placeholder="CRM, Data Cleaning, Operations"
            value={form.skillsText}
          />
        </div>
        <RiskHandlingEditor
          items={form.riskHandling}
          onChange={(items) => setField("riskHandling", items)}
        />
        <CommunicationPlanEditor
          value={form.communicationPlan}
          onChange={(value) => setField("communicationPlan", value)}
        />
      </Section>

      <Section description="Set when you can start and how much capacity you can commit." title="Availability">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Can start"
            onChange={(event) => setNested("availability", "canStart", event.target.value)}
            options={PLAN_CAN_START_OPTIONS}
            placeholder=""
            value={form.availability.canStart}
          />
          {form.availability.canStart === "custom" ? (
            <Input
              label="Custom start date"
              onChange={(event) => setNested("availability", "customStartDate", event.target.value)}
              type="date"
              value={form.availability.customStartDate}
            />
          ) : null}
          <Input
            label="Hours per week"
            min="1"
            onChange={(event) => setNested("availability", "hoursPerWeek", event.target.value)}
            placeholder="10"
            type="number"
            value={form.availability.hoursPerWeek}
          />
        </div>
        <Textarea
          label="Availability note"
          onChange={(event) => setNested("availability", "note", event.target.value)}
          placeholder="Mention kickoff constraints or working cadence."
          rows={3}
          value={form.availability.note}
        />
      </Section>

      <Section description="Attach links only. Proof Vault upload comes later." title="Attachments foundation">
        <AttachmentEditor items={form.attachments} onChange={(items) => setField("attachments", items)} />
      </Section>

      {errors.challengeId || errors.general ? (
        <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] p-4 text-sm font-semibold text-[#991B1B]">
          {errors.challengeId || errors.general}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 rounded-3xl border border-[#E9E2F3] bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
        <Button className="w-full sm:w-auto" onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        {canWithdraw ? (
          <Button
            className="w-full sm:w-auto"
            isLoading={isWithdrawing}
            loadingLabel="Withdrawing..."
            onClick={onWithdraw}
            type="button"
            variant="outline"
          >
            <XCircle aria-hidden="true" className="mr-2 h-4 w-4" />
            Withdraw Plan
          </Button>
        ) : null}
        <Button
          className="w-full sm:w-auto"
          isLoading={isSubmitting}
          loadingLabel={mode === "edit" ? "Saving..." : "Submitting..."}
          type="submit"
        >
          {mode === "edit" ? <Save aria-hidden="true" className="mr-2 h-4 w-4" /> : <Send aria-hidden="true" className="mr-2 h-4 w-4" />}
          {mode === "edit" ? "Save Changes" : "Submit Execution Plan"}
        </Button>
      </div>
    </form>
  );
}
