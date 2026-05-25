import { Edit3, GraduationCap } from "lucide-react";
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
  const end = formatMonthYear(item.endDate);

  if (start && end) {
    return `${start} - ${end}`;
  }

  return start || end || "";
}

export function EducationSection({
  education = [],
  isOwner = false,
  onAdd,
  onEditItem,
}) {
  const hasItems = Array.isArray(education) && education.length > 0;

  if (!hasItems && !isOwner) {
    return null;
  }

  return (
    <ProfileSection
      addLabel="Add education"
      empty={!hasItems}
      emptyActionText="Add education"
      emptyDescription="Add your education, certifications, or learning background."
      emptyTitle="Add education"
      isOwner={isOwner}
      onAdd={onAdd}
      title="Education"
    >
      <div className="divide-y divide-[#E7E5E4]">
        {education.map((item, index) => {
          const school = item.school || item.institution || "School";
          const degree = [item.degree, item.fieldOfStudy].filter(Boolean).join(" | ");
          const dateRange = formatDateRange(item);
          const description = item.description || item.notes;

          return (
            <article
              className="group grid gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[auto_minmax(0,1fr)]"
              key={item.id || item._id || `${school}-${degree}-${index}`}
            >
              <div
                aria-hidden="true"
                className="grid h-12 w-12 place-items-center rounded-2xl border border-[#ECFCCB] bg-[#F7FEE7] text-[#365314]"
              >
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-lg font-black tracking-[-0.03em] text-[#1C1917]">
                      {school}
                    </h3>
                    {degree ? (
                      <p className="mt-1 break-words text-sm font-bold text-[#365314]">
                        {degree}
                      </p>
                    ) : null}
                    {dateRange || item.grade ? (
                      <p className="mt-1 break-words text-xs font-bold uppercase tracking-[0.12em] text-[#78716C]">
                        {[dateRange, item.grade ? `Grade ${item.grade}` : ""]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    ) : null}
                  </div>
                  {isOwner ? (
                    <button
                      aria-label={`Edit education: ${school}`}
                      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E7E5E4] bg-white text-[#44403C] opacity-100 transition hover:border-[#3F6212]/40 hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-4 focus:ring-[#3F6212]/10 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                      onClick={() => onEditItem?.(item)}
                      type="button"
                    >
                      <Edit3 aria-hidden="true" className="h-4 w-4" />
                    </button>
                  ) : null}
                </div>
                {description ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#44403C]">
                    {description}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </ProfileSection>
  );
}
