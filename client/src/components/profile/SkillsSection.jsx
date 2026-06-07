import { Edit3 } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { ProfileSection } from "./ProfileSection.jsx";

function normalizeSkill(skill, index) {
  if (typeof skill === "string") {
    return {
      endorsementsCount: 0,
      isFeatured: false,
      name: skill,
      order: index,
    };
  }

  return {
    endorsementsCount: Number(skill?.endorsementsCount ?? 0),
    isFeatured: Boolean(skill?.isFeatured),
    name: skill?.name || skill?.title || "",
    order: Number.isFinite(Number(skill?.order)) ? Number(skill.order) : index,
  };
}

function getMergedSkills(profileSkills, providerSkills) {
  const byName = new Map();

  [...profileSkills, ...providerSkills]
    .map(normalizeSkill)
    .filter((skill) => skill.name)
    .forEach((skill) => {
      const key = skill.name.trim().toLowerCase();
      const existing = byName.get(key);

      if (!existing) {
        byName.set(key, skill);
        return;
      }

      byName.set(key, {
        ...existing,
        endorsementsCount: Math.max(existing.endorsementsCount, skill.endorsementsCount),
        isFeatured: existing.isFeatured || skill.isFeatured,
        order: Math.min(existing.order, skill.order),
      });
    });

  return Array.from(byName.values()).sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) {
      return a.isFeatured ? -1 : 1;
    }

    return a.order - b.order || a.name.localeCompare(b.name);
  });
}

export function SkillsSection({
  isOwner = false,
  onAdd,
  onEdit,
  providerProfile = null,
  profile = {},
}) {
  const profileSkills = Array.isArray(profile.skills) ? profile.skills : [];
  const providerSkills = Array.isArray(providerProfile?.skills) ? providerProfile.skills : [];
  const skills = getMergedSkills(profileSkills, providerSkills);
  const visibleSkills = skills.slice(0, 12);

  if (!skills.length && !isOwner) {
    return null;
  }

  return (
    <ProfileSection
      action={
        isOwner && skills.length ? (
          <button
            aria-label="Edit Skills"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#E9E2F3] bg-white text-[#493C5E] transition hover:border-[#7C3AED]/40 hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-4 focus:ring-[#7C3AED]/10"
            onClick={onEdit}
            type="button"
          >
            <Edit3 aria-hidden="true" className="h-4 w-4" />
          </button>
        ) : null
      }
      addLabel="Add skills"
      empty={skills.length === 0}
      emptyActionText="Add skills"
      emptyDescription="Highlight the capabilities clients should trust you for."
      emptyTitle="Add skills"
      isOwner={isOwner}
      onAdd={onAdd}
      title="Skills"
    >
      <div className="flex flex-wrap gap-2">
        {visibleSkills.map((skill) => (
          <Badge
            className="transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(124, 58, 237, 0.12)]"
            key={skill.name}
            size="lg"
            variant={skill.isFeatured ? "primary" : "outline"}
          >
            {skill.name}
            {skill.endorsementsCount > 0 ? ` (${skill.endorsementsCount})` : ""}
          </Badge>
        ))}
        {skills.length > visibleSkills.length ? (
          <Badge size="lg" variant="gray">
            +{skills.length - visibleSkills.length} more
          </Badge>
        ) : null}
      </div>
    </ProfileSection>
  );
}
