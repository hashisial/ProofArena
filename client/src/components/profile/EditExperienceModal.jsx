import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const MAX_DESCRIPTION_LENGTH = 1200;

const employmentTypeOptions = [
  { label: "Full-time", value: "full_time" },
  { label: "Part-time", value: "part_time" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
  { label: "Internship", value: "internship" },
  { label: "Self-employed", value: "self_employed" },
  { label: "Volunteer", value: "volunteer" },
];

function toMonthValue(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string" && /^\d{4}-\d{2}/.test(value)) {
    return value.slice(0, 7);
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getInitialForm(initialData = {}) {
  return {
    company: initialData.company || initialData.companyName || "",
    description: initialData.description || "",
    employmentType: initialData.employmentType || "",
    endDate: toMonthValue(initialData.endDate),
    isCurrent: Boolean(initialData.isCurrent),
    location: initialData.location || "",
    skills: Array.isArray(initialData.skills) ? initialData.skills.join(", ") : "",
    startDate: toMonthValue(initialData.startDate),
    title: initialData.title || initialData.role || "",
  };
}

function getPayload(form) {
  return {
    company: form.company.trim(),
    description: form.description.trim(),
    employmentType: form.employmentType || undefined,
    endDate: form.isCurrent ? null : form.endDate || null,
    isCurrent: form.isCurrent,
    location: form.location.trim(),
    skills: form.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 20),
    startDate: form.startDate || null,
    title: form.title.trim(),
  };
}

export function EditExperienceModal({
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
      setFormError("Title is required.");
      return;
    }

    if (payload.title.length < 2) {
      setFormError("Title must be at least 2 characters.");
      return;
    }

    if (form.description.length > MAX_DESCRIPTION_LENGTH) {
      setFormError("Description must be 1,200 characters or fewer.");
      return;
    }

    try {
      await onSubmit?.(payload);
      onClose?.();
    } catch {
      setFormError("We could not save this experience. Please review the fields and try again.");
    }
  }

  async function handleDelete() {
    try {
      await onDelete?.();
      onClose?.();
    } catch {
      setFormError("We could not delete this experience. Please try again.");
    }
  }

  return (
    <Modal
      description="Add role history, outcome delivery notes, and proof-relevant skills."
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
          <Button form="edit-experience-form" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </>
      }
      isOpen={open}
      onClose={isBusy ? undefined : onClose}
      size="lg"
      title={isEditMode ? "Edit experience" : "Add experience"}
    >
      <form className="grid gap-5" id="edit-experience-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Input
          label="Title"
          maxLength={120}
          onChange={(event) => updateField("title", event.target.value)}
          placeholder="Example: Flutter Developer"
          required
          value={form.title}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Company"
            maxLength={120}
            onChange={(event) => updateField("company", event.target.value)}
            placeholder="Example: Self-employed, ScaleOps, ProofArena"
            value={form.company}
          />
          <Select
            label="Employment type"
            onChange={(event) => updateField("employmentType", event.target.value)}
            options={employmentTypeOptions}
            value={form.employmentType}
          />
        </div>

        <Input
          label="Location"
          maxLength={120}
          onChange={(event) => updateField("location", event.target.value)}
          placeholder="Bahawalpur, Punjab, Pakistan"
          value={form.location}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Start date"
            onChange={(event) => updateField("startDate", event.target.value)}
            type="month"
            value={form.startDate}
          />
          <Input
            disabled={form.isCurrent}
            label="End date"
            onChange={(event) => updateField("endDate", event.target.value)}
            type="month"
            value={form.isCurrent ? "" : form.endDate}
          />
        </div>

        <Checkbox
          checked={form.isCurrent}
          label="Currently working here"
          onChange={(event) => updateField("isCurrent", event.target.checked)}
        />

        <Textarea
          helperText={`${form.description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
          label="Description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Describe your responsibilities, outcomes delivered, tools used, and proof-backed achievements."
          rows={6}
          value={form.description}
        />

        <Input
          helperText="Separate skills with commas. Up to 20 skills."
          label="Skills"
          onChange={(event) => updateField("skills", event.target.value)}
          placeholder="React, Firebase, CRM Automation"
          value={form.skills}
        />
      </form>
    </Modal>
  );
}
