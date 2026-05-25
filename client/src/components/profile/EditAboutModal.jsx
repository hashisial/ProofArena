import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const MAX_BIO_LENGTH = 2000;

function getInitialBio(profile = {}) {
  return profile.bio ?? "";
}

export function EditAboutModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  open = false,
  profile = {},
}) {
  const [bio, setBio] = useState(() => getInitialBio(profile));
  const [formError, setFormError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const value = bio.trim();

    if (!value) {
      setFormError("About section cannot be empty.");
      return;
    }

    if (value.length > MAX_BIO_LENGTH) {
      setFormError("About section must be 2,000 characters or fewer.");
      return;
    }

    setFormError("");

    try {
      await onSubmit?.({ bio: value });
      onClose?.();
    } catch {
      setFormError("We could not save your About section. Please try again.");
    }
  }

  return (
    <Modal
      description="Tell people what outcomes you help deliver, how you work, and what makes your proof credible."
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="edit-about-form" isLoading={isSubmitting} type="submit">
            Save changes
          </Button>
        </>
      }
      isOpen={open}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
      title="Edit About"
    >
      <form className="grid gap-4" id="edit-about-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Textarea
          error={bio.length > MAX_BIO_LENGTH ? "About section is over the character limit." : ""}
          helperText={`${bio.length}/${MAX_BIO_LENGTH} characters`}
          label="About"
          maxLength={MAX_BIO_LENGTH}
          onChange={(event) => setBio(event.target.value)}
          placeholder="Example: I help businesses build outcome-focused systems across web development, automation, CRM workflows, and proof-based delivery."
          required
          rows={10}
          value={bio}
        />
      </form>
    </Modal>
  );
}
