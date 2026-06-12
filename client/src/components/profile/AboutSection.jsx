import { ProfileSection } from "./ProfileSection.jsx";

export function AboutSection({ isOwner = false, onEdit, profile = {} }) {
  const about = String(profile.bio || "").trim();

  if (!about && !isOwner) {
    return null;
  }

  return (
    <ProfileSection
      editLabel="Edit About section"
      empty={!about}
      emptyActionText="Add about"
      emptyDescription="Tell clients and providers what you do, what outcomes you help deliver, and what makes your work credible."
      emptyTitle="Add an About section"
      isOwner={isOwner}
      onAdd={onEdit}
      onEdit={about ? onEdit : undefined}
      title="About"
    >
      <p className="max-w-4xl whitespace-pre-line text-sm leading-7 text-[#44403C] sm:text-base">
        {about}
      </p>
    </ProfileSection>
  );
}
