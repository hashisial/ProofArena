import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const MAX_DESCRIPTION_LENGTH = 800;

const deliveryTypeOptions = [
  { label: "Fixed scope", value: "fixed_scope" },
  { label: "Hourly", value: "hourly" },
  { label: "Milestone-based", value: "milestone" },
  { label: "Consultation", value: "consultation" },
  { label: "Managed outcome", value: "managed_outcome" },
];

const currencyOptions = [
  { label: "USD", value: "USD" },
  { label: "PKR", value: "PKR" },
  { label: "GBP", value: "GBP" },
  { label: "EUR", value: "EUR" },
  { label: "AUD", value: "AUD" },
  { label: "CAD", value: "CAD" },
];

function splitTags(value) {
  return Array.from(
    new Set(
      String(value ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 10);
}

function getInitialForm(initialData = {}) {
  return {
    category: initialData.category || "",
    currency: initialData.currency || "USD",
    deliveryType: initialData.deliveryType || "",
    description: initialData.description || "",
    isActive: initialData.isActive !== false,
    proofRequired: Array.isArray(initialData.proofRequired)
      ? initialData.proofRequired.join(", ")
      : "",
    startingPrice:
      initialData.startingPrice === null || initialData.startingPrice === undefined
        ? ""
        : String(initialData.startingPrice),
    title: initialData.title || initialData.name || "",
  };
}

function getPayload(form) {
  const priceText = String(form.startingPrice ?? "").trim();

  return {
    category: form.category.trim(),
    currency: form.currency || "USD",
    deliveryType: form.deliveryType || undefined,
    description: form.description.trim(),
    isActive: Boolean(form.isActive),
    proofRequired: splitTags(form.proofRequired),
    startingPrice: priceText ? Number(priceText) : 0,
    title: form.title.trim(),
  };
}

export function EditServiceModal({
  initialData = {},
  isDeleting = false,
  isSubmitting = false,
  mode = "add",
  onClose,
  onDelete,
  onSubmit,
  open = false,
}) {
  const [form, setForm] = useState(() => getInitialForm(initialData));
  const [formError, setFormError] = useState("");
  const isEditMode = mode === "edit";
  const isBusy = isSubmitting || isDeleting;

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = getPayload(form);

    if (!payload.title) {
      setFormError("Service title is required.");
      return;
    }

    if (payload.title.length < 2) {
      setFormError("Service title must be at least 2 characters.");
      return;
    }

    if (form.description.length > MAX_DESCRIPTION_LENGTH) {
      setFormError("Description must be 800 characters or fewer.");
      return;
    }

    if (!Number.isFinite(payload.startingPrice) || payload.startingPrice < 0) {
      setFormError("Starting price cannot be negative.");
      return;
    }

    try {
      await onSubmit?.(payload);
      onClose?.();
    } catch {
      setFormError("We could not save this service. Please review the fields and try again.");
    }
  }

  async function handleDelete() {
    try {
      await onDelete?.();
      onClose?.();
    } catch {
      setFormError("We could not delete this service. Please try again.");
    }
  }

  return (
    <Modal
      description="Describe a measurable outcome, delivery workflow, and proof expectations for clients."
      footer={
        <>
          {isEditMode ? (
            <Button
              className="border-[#FECACA] bg-white text-[#DC2626] hover:border-[#DC2626]/50 hover:bg-[#FEE2E2] hover:text-[#991B1B]"
              disabled={isBusy}
              isLoading={isDeleting}
              loadingLabel="Deleting..."
              onClick={handleDelete}
              type="button"
              variant="secondary"
            >
              Delete
            </Button>
          ) : null}
          <Button disabled={isBusy} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="edit-service-form" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </>
      }
      isOpen={open}
      onClose={isBusy ? undefined : onClose}
      size="lg"
      title={isEditMode ? "Edit service" : "Add service"}
    >
      <form className="grid gap-5" id="edit-service-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Input
          label="Service title"
          maxLength={120}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Example: CRM Automation Setup"
          required
          value={form.title}
        />

        <Input
          label="Category"
          maxLength={80}
          onChange={(event) => updateField("category", event.target.value)}
          placeholder="Example: Automation, Lead Generation, Web Development"
          value={form.category}
        />

        <Textarea
          helperText={`${form.description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
          label="Description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe the outcome you can deliver, your workflow, and what proof clients should expect."
          rows={5}
          value={form.description}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Delivery type"
            onChange={(event) => updateField("deliveryType", event.target.value)}
            options={deliveryTypeOptions}
            value={form.deliveryType}
          />
          <Select
            label="Currency"
            onChange={(event) => updateField("currency", event.target.value)}
            options={currencyOptions}
            placeholder=""
            value={form.currency}
          />
        </div>

        <Input
          label="Starting price"
          min="0"
          onChange={(event) => updateField("startingPrice", event.target.value)}
          placeholder="Example: 500"
          type="number"
          value={form.startingPrice}
        />

        <Input
          helperText="Separate proof items with commas. Up to 10 proof expectations."
          label="Proof required"
          onChange={(event) => updateField("proofRequired", event.target.value)}
          placeholder="CRM screenshots, automation logs, dashboard link"
          value={form.proofRequired}
        />

        <Checkbox
          checked={form.isActive}
          description="Inactive services stay visible only to you."
          label="Show this service publicly"
          onChange={(event) => updateField("isActive", event.target.checked)}
        />
      </form>
    </Modal>
  );
}
