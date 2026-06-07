import { useState } from "react";
import { BriefcaseBusiness, Handshake, MessageCircle, Target, UsersRound } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const openToOptions = [
  { icon: Target, label: "Outcome challenges" },
  { icon: BriefcaseBusiness, label: "Provider work" },
  { icon: MessageCircle, label: "Consulting calls" },
  { icon: UsersRound, label: "Team projects" },
  { icon: Handshake, label: "Partnerships" },
];

const MAX_NOTE_LENGTH = 500;

function normalizeCategories(categories) {
  return Array.from(
    new Set(
      (Array.isArray(categories) ? categories : [])
        .map((item) => String(item ?? "").trim())
        .filter(Boolean),
    ),
  ).slice(0, 10);
}

export function OpenToModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  open = false,
  profileData,
}) {
  const profile = profileData?.profile ?? {};
  const [enabled, setEnabled] = useState(() => Boolean(profile.openTo?.enabled));
  const [selected, setSelected] = useState(() => normalizeCategories(profile.openTo?.categories));
  const [title, setTitle] = useState(() => profile.openTo?.title ?? "");
  const [note, setNote] = useState(() => profile.openTo?.note ?? "");
  const [formError, setFormError] = useState("");

  function toggleOption(label) {
    setSelected((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label],
    );
    setFormError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (note.length > MAX_NOTE_LENGTH) {
      setFormError("Short note must be 500 characters or fewer.");
      return;
    }

    const payload = {
      categories: enabled ? normalizeCategories(selected) : [],
      enabled,
      note: enabled ? note.trim() : "",
      title: enabled ? title.trim() : "",
    };

    try {
      await onSubmit?.(payload);
      onClose?.();
    } catch {
      setFormError("We could not save your Open To preferences. Please try again.");
    }
  }

  return (
    <Modal
      description="Show what kind of outcomes, projects, or collaborations you are open to."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="open-to-form" isLoading={isSubmitting} type="submit">
            Save preference
          </Button>
        </>
      }
      isOpen={open}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
      title="Open to opportunities"
    >
      <form className="grid gap-5" id="open-to-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <Checkbox
          checked={enabled}
          description="Show this preference on your public ProofArena profile."
          label="Enable Open To"
          onChange={(event) => {
            setEnabled(event.target.checked);
            setFormError("");
          }}
        />

        <Input
          disabled={!enabled}
          label="Open to title"
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Example: Open to outcome challenges and CRM automation projects"
          value={title}
        />

        <div className="grid gap-2" aria-disabled={!enabled}>
          <p className="text-sm font-bold text-[#07030D]">Categories</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {openToOptions.map((option) => {
              const Icon = option.icon;
              const isActive = selected.includes(option.label);

              return (
                <button
                  className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10 ${
                    isActive
                      ? "border-[#7C3AED]/45 bg-[#F5F3FF] text-[#5B21B6]"
                      : "border-[#E9E2F3] bg-white text-[#493C5E] hover:border-[#A78BFA]"
                  }`}
                  disabled={!enabled}
                  key={option.label}
                  onClick={() => toggleOption(option.label)}
                  type="button"
                >
                  <Icon aria-hidden="true" className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-black">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Textarea
          disabled={!enabled}
          helperText={`${note.length}/${MAX_NOTE_LENGTH} characters`}
          label="Short note"
          maxLength={MAX_NOTE_LENGTH}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Tell clients what kind of measurable outcomes you are currently open to."
          rows={4}
          value={note}
        />
      </form>
    </Modal>
  );
}
