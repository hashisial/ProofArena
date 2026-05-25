import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const MAX_DESCRIPTION_LENGTH = 1200;

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
    degree: initialData.degree || "",
    description: initialData.description || initialData.notes || "",
    endDate: toMonthValue(initialData.endDate),
    fieldOfStudy: initialData.fieldOfStudy || "",
    grade: initialData.grade || "",
    school: initialData.school || initialData.institution || "",
    startDate: toMonthValue(initialData.startDate),
  };
}

function getPayload(form) {
  return {
    degree: form.degree.trim(),
    description: form.description.trim(),
    endDate: form.endDate || null,
    fieldOfStudy: form.fieldOfStudy.trim(),
    grade: form.grade.trim(),
    school: form.school.trim(),
    startDate: form.startDate || null,
  };
}

export function EditEducationModal({
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

    if (!payload.school) {
      setFormError("School is required.");
      return;
    }

    if (payload.school.length < 2) {
      setFormError("School must be at least 2 characters.");
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
      setFormError("We could not save this education item. Please review the fields and try again.");
    }
  }

  async function handleDelete() {
    try {
      await onDelete?.();
      onClose?.();
    } catch {
      setFormError("We could not delete this education item. Please try again.");
    }
  }

  return (
    <Modal
      description="Add education, coursework, projects, certifications, or academic achievements."
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
          <Button form="edit-education-form" isLoading={isSubmitting} type="submit">
            Save
          </Button>
        </>
      }
      isOpen={open}
      onClose={isBusy ? undefined : onClose}
      size="lg"
      title={isEditMode ? "Edit education" : "Add education"}
    >
      <form className="grid gap-5" id="edit-education-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Input
          label="School"
          maxLength={140}
          onChange={(event) => updateField("school", event.target.value)}
          placeholder="Example: Islamia University of Bahawalpur"
          required
          value={form.school}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Degree"
            maxLength={140}
            onChange={(event) => updateField("degree", event.target.value)}
            placeholder="Example: BS Information Technology"
            value={form.degree}
          />
          <Input
            label="Field of study"
            maxLength={140}
            onChange={(event) => updateField("fieldOfStudy", event.target.value)}
            placeholder="Example: Information Technology"
            value={form.fieldOfStudy}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Start date"
            onChange={(event) => updateField("startDate", event.target.value)}
            type="month"
            value={form.startDate}
          />
          <Input
            label="End date"
            onChange={(event) => updateField("endDate", event.target.value)}
            type="month"
            value={form.endDate}
          />
        </div>

        <Input
          label="Grade"
          maxLength={80}
          onChange={(event) => updateField("grade", event.target.value)}
          placeholder="Example: CGPA, grade, or honors"
          value={form.grade}
        />

        <Textarea
          helperText={`${form.description.length}/${MAX_DESCRIPTION_LENGTH} characters`}
          label="Description"
          maxLength={MAX_DESCRIPTION_LENGTH}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Add relevant coursework, projects, certifications, or academic achievements."
          rows={6}
          value={form.description}
        />
      </form>
    </Modal>
  );
}
