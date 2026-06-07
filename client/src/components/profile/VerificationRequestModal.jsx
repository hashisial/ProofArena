import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const MAX_NOTE_LENGTH = 1000;

const verificationTypeOptions = [
  { label: "Identity verification", value: "identity" },
  { label: "Provider verification", value: "provider" },
  { label: "Business verification", value: "business" },
  { label: "Proof-based verification", value: "proof_based" },
];

function splitLinks(value) {
  return Array.from(
    new Set(
      String(value ?? "")
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ).slice(0, 5);
}

function isValidUrl(value) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function VerificationRequestModal({
  currentStatus,
  isSubmitting = false,
  onClose,
  onSubmit,
  open = false,
}) {
  const [form, setForm] = useState({
    requestNote: currentStatus?.requestNote ?? "",
    supportingLinks: Array.isArray(currentStatus?.supportingLinks)
      ? currentStatus.supportingLinks.join("\n")
      : "",
    verificationType: currentStatus?.verificationType ?? "identity",
    website: currentStatus?.website ?? "",
  });
  const [formError, setFormError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const supportingLinks = splitLinks(form.supportingLinks);

    if (form.requestNote.length > MAX_NOTE_LENGTH) {
      setFormError("Request note must be 1,000 characters or fewer.");
      return;
    }

    if (form.website && !isValidUrl(form.website)) {
      setFormError("Website must be a valid http or https URL.");
      return;
    }

    if (supportingLinks.some((link) => !isValidUrl(link))) {
      setFormError("Supporting links must be valid http or https URLs.");
      return;
    }

    try {
      await onSubmit?.({
        requestNote: form.requestNote.trim(),
        supportingLinks,
        verificationType: form.verificationType,
        website: form.website.trim(),
      });
      onClose?.();
    } catch {
      setFormError("We could not submit this verification request. Please try again.");
    }
  }

  return (
    <Modal
      description="Verification helps clients and providers identify credible ProofArena profiles."
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="verification-request-form" isLoading={isSubmitting} type="submit">
            Submit request
          </Button>
        </>
      }
      isOpen={open}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
      title="Request verification"
    >
      <form className="grid gap-5" id="verification-request-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Select
          label="Verification type"
          onChange={(event) => updateField("verificationType", event.target.value)}
          options={verificationTypeOptions}
          placeholder=""
          value={form.verificationType}
        />

        <Input
          label="Website or profile link"
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="https://yourwebsite.com"
          type="url"
          value={form.website}
        />

        <Textarea
          helperText="Separate links with commas or new lines. Up to 5 links."
          label="Supporting links"
          onChange={(event) => updateField("supportingLinks", event.target.value)}
          placeholder="Portfolio, company profile, case study, proof record links..."
          rows={4}
          value={form.supportingLinks}
        />

        <Textarea
          helperText={`${form.requestNote.length}/${MAX_NOTE_LENGTH} characters`}
          label="Request note"
          maxLength={MAX_NOTE_LENGTH}
          onChange={(event) => updateField("requestNote", event.target.value)}
          placeholder="Explain why your profile should be verified and what proof supports your credibility."
          rows={5}
          value={form.requestNote}
        />

        <div className="rounded-2xl border border-[#EDE9FE] bg-[#F8F4FF] p-4 text-sm font-semibold leading-6 text-[#6F657C]">
          Submitting a request does not guarantee approval. ScaleOps admins will review
          verification requests in a later admin workflow.
        </div>
      </form>
    </Modal>
  );
}
