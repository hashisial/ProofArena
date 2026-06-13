import { ArrowDown, ArrowUp, Plus, Star, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Modal } from "../ui/Modal.jsx";
import { cn } from "../../utils/cn.js";

const MAX_SKILLS = 30;
const MAX_SKILL_LENGTH = 50;

function normalizeSkill(skill, index) {
  if (typeof skill === "string") {
    return {
      isFeatured: false,
      name: skill.trim(),
      order: index,
    };
  }

  return {
    isFeatured: Boolean(skill?.isFeatured),
    name: String(skill?.name || "").trim(),
    order: Number.isFinite(Number(skill?.order)) ? Number(skill.order) : index,
  };
}

function normalizeSkills(skills = []) {
  const byName = new Map();

  (Array.isArray(skills) ? skills : [])
    .map(normalizeSkill)
    .filter((skill) => skill.name)
    .sort((a, b) => a.order - b.order)
    .forEach((skill) => {
      const key = skill.name.toLowerCase();

      if (!byName.has(key)) {
        byName.set(key, skill);
      }
    });

  return Array.from(byName.values())
    .slice(0, MAX_SKILLS)
    .map((skill, index) => ({ ...skill, order: index }));
}

function moveItem(items, fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);

  return nextItems.map((skill, index) => ({ ...skill, order: index }));
}

export function EditSkillsModal({
  isSubmitting = false,
  onClose,
  onSubmit,
  open = false,
  skills = [],
}) {
  const [items, setItems] = useState(() => normalizeSkills(skills));
  const [skillInput, setSkillInput] = useState("");
  const [formError, setFormError] = useState("");

  function addSkill(name = skillInput) {
    const value = name.trim();

    if (!value) {
      setFormError("Skill name cannot be empty.");
      return false;
    }

    if (value.length > MAX_SKILL_LENGTH) {
      setFormError("Skill names must be 50 characters or fewer.");
      return false;
    }

    if (items.length >= MAX_SKILLS) {
      setFormError("You can add up to 30 skills.");
      return false;
    }

    if (items.some((skill) => skill.name.toLowerCase() === value.toLowerCase())) {
      setFormError("That skill is already listed.");
      return false;
    }

    setItems((current) => [
      ...current,
      {
        isFeatured: false,
        name: value,
        order: current.length,
      },
    ]);
    setSkillInput("");
    setFormError("");
    return true;
  }

  function removeSkill(index) {
    setItems((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((skill, itemIndex) => ({ ...skill, order: itemIndex })),
    );
  }

  function toggleFeatured(index) {
    setItems((current) =>
      current.map((skill, itemIndex) =>
        itemIndex === index ? { ...skill, isFeatured: !skill.isFeatured } : skill,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    let nextItems = items;

    if (skillInput.trim()) {
      const wasAdded = addSkill();

      if (!wasAdded) {
        return;
      }

      nextItems = [
        ...items,
        {
          isFeatured: false,
          name: skillInput.trim(),
          order: items.length,
        },
      ];
    }

    setFormError("");

    try {
      await onSubmit?.({
        skills: nextItems.map((skill, index) => ({
          isFeatured: Boolean(skill.isFeatured),
          name: skill.name.trim(),
          order: index,
        })),
      });
      onClose?.();
    } catch {
      setFormError("We could not save your skills. Please try again.");
    }
  }

  return (
    <Modal
      description="Add skills that describe the outcomes, tools, and workflows you can deliver."
      footer={
        <>
          <Button disabled={isSubmitting} onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button form="edit-skills-form" isLoading={isSubmitting} type="submit">
            Save skills
          </Button>
        </>
      }
      isOpen={open}
      onClose={isSubmitting ? undefined : onClose}
      size="lg"
      title="Edit Skills"
    >
      <form className="grid gap-5" id="edit-skills-form" onSubmit={handleSubmit}>
        {formError ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {formError}
          </div>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <Input
            helperText={`${items.length}/${MAX_SKILLS} skills added`}
            label="Add a skill"
            maxLength={MAX_SKILL_LENGTH}
            onChange={(event) => {
              setSkillInput(event.target.value);
              setFormError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addSkill();
              }
            }}
            placeholder="Add a skill like React, Lead Generation, CRM Automation, Firebase, WordPress..."
            value={skillInput}
          />
          <Button
            className="w-full sm:w-auto"
            disabled={!skillInput.trim() || items.length >= MAX_SKILLS}
            onClick={() => addSkill()}
            type="button"
            variant="outline"
          >
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            Add skill
          </Button>
        </div>

        <div className="grid gap-3">
          {items.length ? (
            items.map((skill, index) => (
              <div
                className="flex min-w-0 flex-col gap-3 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-3 sm:flex-row sm:items-center"
                key={`${skill.name}-${index}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="break-words text-sm font-black text-[#1C1917]">{skill.name}</p>
                  <p className="mt-1 text-xs font-semibold text-[#78716C]">
                    {skill.isFeatured ? "Featured skill" : "Standard skill"}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    aria-label={`${skill.isFeatured ? "Unfeature" : "Feature"} skill ${skill.name}`}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border transition focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10",
                      skill.isFeatured
                        ? "border-[#3F6212]/30 bg-[#F7FEE7] text-[#365314]"
                        : "border-[#E7E5E4] bg-white text-[#78716C] hover:border-[#3F6212]/40 hover:text-[#365314]",
                    )}
                    onClick={() => toggleFeatured(index)}
                    type="button"
                  >
                    <Star aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Move skill ${skill.name} up`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#78716C] transition hover:border-[#3F6212]/40 hover:text-[#365314] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === 0}
                    onClick={() => setItems((current) => moveItem(current, index, index - 1))}
                    type="button"
                  >
                    <ArrowUp aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Move skill ${skill.name} down`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#78716C] transition hover:border-[#3F6212]/40 hover:text-[#365314] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 disabled:cursor-not-allowed disabled:opacity-40"
                    disabled={index === items.length - 1}
                    onClick={() => setItems((current) => moveItem(current, index, index + 1))}
                    type="button"
                  >
                    <ArrowDown aria-hidden="true" className="h-4 w-4" />
                  </button>
                  <button
                    aria-label={`Remove skill ${skill.name}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FECACA] bg-white text-[#DC2626] transition hover:bg-[#FEE2E2] focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10"
                    onClick={() => removeSkill(index)}
                    type="button"
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D9F99D] bg-[#F7FEE7]/45 p-4 text-sm font-semibold leading-6 text-[#365314]">
              Add your first skill to help clients understand what outcomes you can deliver.
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
