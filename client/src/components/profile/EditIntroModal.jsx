import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";

const initialForm = {
  city: "",
  country: "",
  currentCompany: "",
  currentPosition: "",
  fullName: "",
  headline: "",
  industry: "",
  website: "",
};

function getLocation(profile = {}) {
  return typeof profile.location === "string"
    ? { city: profile.location, country: "" }
    : {
        city: profile.location?.city ?? "",
        country: profile.location?.country ?? "",
      };
}

function getInitialForm(profileData = {}) {
  const user = profileData.user ?? {};
  const profile = profileData.profile ?? {};
  const location = getLocation(profile);

  return {
    city: location.city,
    country: location.country,
    currentCompany: profile.currentCompany || profile.companyName || "",
    currentPosition: profile.currentPosition || "",
    fullName: user.fullName || user.name || user.username || "",
    headline: profile.headline || "",
    industry: profile.industry || "",
    website: profile.website || "",
  };
}

function trimForm(form) {
  return Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, String(value ?? "").trim()]),
  );
}

export function EditIntroModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  open = false,
  profileData,
}) {
  const [form, setForm] = useState(() => (open ? getInitialForm(profileData) : initialForm));
  const [formError, setFormError] = useState("");

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const values = trimForm(form);

    if (!values.fullName) {
      setFormError("Full name is required.");
      return;
    }

    if (values.fullName.length > 80) {
      setFormError("Full name must be 80 characters or fewer.");
      return;
    }

    if (values.headline.length > 180) {
      setFormError("Headline must be 180 characters or fewer.");
      return;
    }

    setFormError("");

    try {
      await onSubmit?.({
        companyName: values.currentCompany,
        currentCompany: values.currentCompany,
        currentPosition: values.currentPosition,
        fullName: values.fullName,
        headline: values.headline,
        industry: values.industry,
        location: {
          city: values.city,
          country: values.country,
        },
        website: values.website,
      });
      onClose?.();
    } catch {
      setFormError("We could not save your intro. Please review the fields and try again.");
    }
  }

  return (
    <Modal
      description="Update the information people see at the top of your ProofArena profile."
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="edit-profile-intro-form" isLoading={isSubmitting} type="submit">
            Save changes
          </Button>
        </>
      }
      isOpen={open}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
      title="Edit intro"
    >
      <form className="grid gap-5" id="edit-profile-intro-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Input
          label="Full name"
          maxLength={80}
          onChange={(event) => updateField("fullName", event.target.value)}
          required
          value={form.fullName}
        />
        <Input
          helperText={`${form.headline.length}/180 characters`}
          label="Headline"
          maxLength={180}
          onChange={(event) => updateField("headline", event.target.value)}
          placeholder="Example: MERN Stack Developer | Outcome-Based Delivery | CRM Automation"
          value={form.headline}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Current position"
            onChange={(event) => updateField("currentPosition", event.target.value)}
            placeholder="Founder, Developer, Growth Specialist..."
            value={form.currentPosition}
          />
          <Input
            label="Current company"
            onChange={(event) => updateField("currentCompany", event.target.value)}
            placeholder="ScaleOps, ProofArena, Self-employed..."
            value={form.currentCompany}
          />
        </div>

        <Input
          label="Industry"
          onChange={(event) => updateField("industry", event.target.value)}
          placeholder="Software, Real Estate, Crypto, Marketing..."
          value={form.industry}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="City"
            onChange={(event) => updateField("city", event.target.value)}
            value={form.city}
          />
          <Input
            label="Country"
            onChange={(event) => updateField("country", event.target.value)}
            value={form.country}
          />
        </div>

        <Input
          label="Website"
          onChange={(event) => updateField("website", event.target.value)}
          placeholder="https://example.com"
          type="url"
          value={form.website}
        />
      </form>
    </Modal>
  );
}
