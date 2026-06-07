import { Save } from "lucide-react";
import {
  AVAILABILITY_OPTIONS,
  CATEGORY_OPTIONS,
  CURRENCY_OPTIONS,
  DELIVERY_TYPE_OPTIONS,
  PRICE_TYPE_OPTIONS,
  VISIBILITY_OPTIONS,
} from "../../features/outcomeOffers/outcomeOfferUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { MilestoneTemplateEditor } from "./MilestoneTemplateEditor.jsx";
import { ProofIncludedEditor } from "./ProofIncludedEditor.jsx";
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

export function OutcomeOfferForm({
  errors = {},
  form,
  isArchiving = false,
  isPausing = false,
  isPublishing = false,
  isSubmitting = false,
  mode = "create",
  onArchive,
  onCancel,
  onChange,
  onPause,
  onPublish,
  onSubmit,
  offerStatus = "draft",
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

  const canPause = offerStatus === "published";
  const canArchive = mode === "edit" && offerStatus !== "archived";

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <Section
        description="Name the measurable result, who it helps, and why the offer is worth considering."
        title="Basic offer"
      >
        <Input
          error={errors.title}
          label="Title"
          onChange={(event) => setField("title", event.target.value)}
          placeholder="Generate 30 qualified real estate seller leads"
          required
          value={form.title}
        />
        <Textarea
          error={errors.shortSummary}
          label="Short summary"
          maxLength={280}
          onChange={(event) => setField("shortSummary", event.target.value)}
          placeholder="Get CRM-ready seller leads with qualification notes and weekly reporting."
          required
          rows={3}
          value={form.shortSummary}
        />
        <Textarea
          error={errors.description}
          label="Description"
          onChange={(event) => setField("description", event.target.value)}
          placeholder="Explain who this is for, what you deliver, how the work happens, and what proof the client receives."
          required
          rows={6}
          value={form.description}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            error={errors.category}
            label="Category"
            onChange={(event) => setField("category", event.target.value)}
            options={CATEGORY_OPTIONS}
            placeholder=""
            required
            value={form.category}
          />
          <Input
            label="Sub-category"
            onChange={(event) => setField("subCategory", event.target.value)}
            placeholder="Real estate seller leads"
            value={form.subCategory}
          />
        </div>
        <Input
          label="Target client"
          onChange={(event) => setField("targetClient", event.target.value)}
          placeholder="Real estate agents, agencies, investors"
          value={form.targetClient}
        />
      </Section>

      <Section
        description="Make the result measurable so a client can evaluate the offer before inviting you."
        title="Target outcome"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <Input
            error={errors.metricName}
            label="Metric name"
            onChange={(event) => setNested("targetOutcome", "metricName", event.target.value)}
            placeholder="Qualified seller leads"
            required
            value={form.targetOutcome.metricName}
          />
          <Input
            error={errors.targetValue}
            label="Target value"
            onChange={(event) => setNested("targetOutcome", "targetValue", event.target.value)}
            placeholder="30"
            required
            value={form.targetOutcome.targetValue}
          />
          <Input
            label="Unit"
            onChange={(event) => setNested("targetOutcome", "unit", event.target.value)}
            placeholder="leads"
            value={form.targetOutcome.unit}
          />
        </div>
        <Textarea
          error={errors.outcomeStatement}
          label="Outcome statement"
          onChange={(event) => setNested("targetOutcome", "outcomeStatement", event.target.value)}
          placeholder="Generate 30 qualified real estate seller leads in 30 days."
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

      <Section title="Proof included">
        <ProofIncludedEditor
          error={errors.proofIncluded}
          items={form.proofIncluded}
          onChange={(items) => setField("proofIncluded", items)}
        />
      </Section>

      <Section
        description="Set the delivery window and pricing model. Hidden pricing is valid for private scoping, but public offers are stronger with a visible range."
        title="Timeline and price"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Timeline type"
            onChange={(event) => setNested("deliveryTimeline", "type", event.target.value)}
            options={DELIVERY_TYPE_OPTIONS}
            placeholder=""
            value={form.deliveryTimeline.type}
          />
          {form.deliveryTimeline.type === "fixed_days" ? (
            <Input
              error={errors.days}
              label="Days"
              min="1"
              onChange={(event) => setNested("deliveryTimeline", "days", event.target.value)}
              placeholder="30"
              type="number"
              value={form.deliveryTimeline.days}
            />
          ) : null}
          {form.deliveryTimeline.type === "range_days" ? (
            <>
              <Input
                label="Minimum days"
                min="1"
                onChange={(event) => setNested("deliveryTimeline", "minDays", event.target.value)}
                placeholder="14"
                type="number"
                value={form.deliveryTimeline.minDays}
              />
              <Input
                error={errors.maxDays}
                label="Maximum days"
                min="1"
                onChange={(event) => setNested("deliveryTimeline", "maxDays", event.target.value)}
                placeholder="30"
                type="number"
                value={form.deliveryTimeline.maxDays}
              />
            </>
          ) : null}
          {form.deliveryTimeline.type === "custom" ? (
            <Input
              label="Custom timeline label"
              onChange={(event) => setNested("deliveryTimeline", "customLabel", event.target.value)}
              placeholder="Scoped after intake"
              value={form.deliveryTimeline.customLabel}
            />
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Price type"
            onChange={(event) => setNested("priceRange", "type", event.target.value)}
            options={PRICE_TYPE_OPTIONS}
            placeholder=""
            value={form.priceRange.type}
          />
          <Select
            label="Currency"
            onChange={(event) => setNested("priceRange", "currency", event.target.value)}
            options={CURRENCY_OPTIONS}
            placeholder=""
            value={form.priceRange.currency}
          />
          {["fixed", "starting_at", "range"].includes(form.priceRange.type) ? (
            <Input
              error={errors.priceMin}
              label={form.priceRange.type === "range" ? "Minimum price" : "Price"}
              min="0"
              onChange={(event) => setNested("priceRange", "min", event.target.value)}
              placeholder="1200"
              type="number"
              value={form.priceRange.min}
            />
          ) : null}
          {form.priceRange.type === "range" ? (
            <Input
              error={errors.priceMax}
              label="Maximum price"
              min="0"
              onChange={(event) => setNested("priceRange", "max", event.target.value)}
              placeholder="2400"
              type="number"
              value={form.priceRange.max}
            />
          ) : null}
          {form.priceRange.type === "custom" ? (
            <Input
              label="Custom price label"
              onChange={(event) => setNested("priceRange", "customLabel", event.target.value)}
              placeholder="Scoped after discovery"
              value={form.priceRange.customLabel}
            />
          ) : null}
        </div>
      </Section>

      <Section title="Milestone template">
        <MilestoneTemplateEditor
          items={form.milestoneTemplate}
          onChange={(items) => setField("milestoneTemplate", items)}
        />
      </Section>

      <Section
        description="Use comma-separated terms. These will support future matching and discovery."
        title="Skills, tools, industries, and tags"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Textarea
            label="Skills"
            onChange={(event) => setField("skillsText", event.target.value)}
            placeholder="Lead Generation, CRM, Data Cleaning"
            rows={3}
            value={form.skillsText}
          />
          <Textarea
            label="Tools"
            onChange={(event) => setField("toolsText", event.target.value)}
            placeholder="Apollo, HubSpot, Google Sheets, Airtable"
            rows={3}
            value={form.toolsText}
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
            placeholder="seller leads, CRM proof, weekly report"
            rows={3}
            value={form.tagsText}
          />
        </div>
      </Section>

      <Section title="Availability and visibility">
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Availability"
            onChange={(event) => setNested("availability", "status", event.target.value)}
            options={AVAILABILITY_OPTIONS}
            placeholder=""
            value={form.availability.status}
          />
          <Input
            label="Capacity per month"
            min="0"
            onChange={(event) => setNested("availability", "capacityPerMonth", event.target.value)}
            placeholder="3"
            type="number"
            value={form.availability.capacityPerMonth}
          />
          <Select
            label="Visibility"
            onChange={(event) => setField("visibility", event.target.value)}
            options={VISIBILITY_OPTIONS}
            placeholder=""
            value={form.visibility}
          />
          <Input
            label="Availability note"
            onChange={(event) => setNested("availability", "note", event.target.value)}
            placeholder="Taking two new outcome offers this month."
            value={form.availability.note}
          />
        </div>
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
