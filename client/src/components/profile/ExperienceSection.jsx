import { BriefcaseBusiness, Edit3 } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { formatDate } from "../../utils/index.js";
import { ProfileSection } from "./ProfileSection.jsx";

function formatMonthYear(value) {
  return formatDate(value, {
    fallback: "",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(item = {}) {
  if (item.duration) {
    return item.duration;
  }

  const start = formatMonthYear(item.startDate);
  const end = item.isCurrent ? "Present" : formatMonthYear(item.endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "";
}

function getLocationText(location) {
  if (typeof location === "string") {
    return location;
  }

  return [location?.city, location?.state, location?.country].filter(Boolean).join(", ");
}

function getSkillName(skill) {
  return typeof skill === "string" ? skill : skill?.name;
}

function formatEmploymentType(value = "") {
  const labels = {
    contract: "Contract",
    freelance: "Freelance",
    full_time: "Full-time",
    internship: "Internship",
    part_time: "Part-time",
    self_employed: "Self-employed",
    volunteer: "Volunteer",
  };

  return labels[value] || value;
}

export function ExperienceSection({
  experience = [],
  isOwner = false,
  onAdd,
  onEditItem,
}) {
  const hasItems = Array.isArray(experience) && experience.length > 0;

  if (!hasItems && !isOwner) {
    return null;
  }

  return (
    <ProfileSection
      addLabel="Add experience"
      empty={!hasItems}
      emptyActionText="Add experience"
      emptyDescription="Show your professional background and the outcomes you have helped deliver."
      emptyTitle="Add experience"
      isOwner={isOwner}
      onAdd={onAdd}
      title="Experience"
    >
      <div className="divide-y divide-[#E7E5E4]">
        {experience.map((item, index) => {
          const title = item.title || item.role || "Role";
          const company = item.company || item.companyName || "Company";
          const employmentType = formatEmploymentType(item.employmentType || item.type || "");
          const dateRange = formatDateRange(item);
          const location = getLocationText(item.location);
          const skills = Array.isArray(item.skills) ? item.skills.map(getSkillName).filter(Boolean) : [];

          return (
            <article
              className="group grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)]"
              key={item.id || item._id || `${company}-${title}-${index}`}
            >
              <div
                aria-hidden="true"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ECFCCB] bg-[#F7FEE7] text-[#365314]"
              >
                <BriefcaseBusiness className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-black tracking-[-0.03em] text-[#1C1917]">
                      {title}
                    </h3>
                    <p className="mt-1 break-words text-sm font-bold text-[#365314]">
                      {[company, employmentType].filter(Boolean).join(" | ")}
                    </p>
                    {item.isCurrent ? (
                      <Badge className="mt-2" size="sm" variant="green">
                        Current
                      </Badge>
                    ) : null}
                    {dateRange || location ? (
                      <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.12em] text-[#78716C]">
                        {[dateRange, location].filter(Boolean).join(" | ")}
                      </p>
                    ) : null}
                  </div>
                  {isOwner ? (
                    <button
                      aria-label={`Edit experience: ${title}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#44403C] opacity-100 transition hover:border-[#3F6212]/40 hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      onClick={() => onEditItem?.(item)}
                      type="button"
                    >
                      <Edit3 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                {item.description ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#44403C]">
                    {item.description}
                  </p>
                ) : null}
                {skills.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.slice(0, 8).map((skill) => (
                      <Badge key={skill} size="sm" variant="primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </ProfileSection>
  );
}
