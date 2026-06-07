import { Select } from "../ui/Select.jsx";
import { cn } from "../../utils/cn.js";
import { challengeManagementTabs, getTabCount } from "./challengeManagementTabs.js";

export function ChallengeManagementTabs({
  activeTab = "all",
  challenges = [],
  onChange,
}) {
  const options = challengeManagementTabs.map((tab) => ({
    label: `${tab.label} (${getTabCount(challenges, tab)})`,
    value: tab.value,
  }));

  return (
    <div>
      <div className="sm:hidden">
        <Select
          label="Challenge status view"
          onChange={(event) => onChange?.(event.target.value)}
          options={options}
          placeholder=""
          value={activeTab}
        />
      </div>
      <div
        aria-label="Challenge management status tabs"
        className="hidden gap-2 overflow-x-auto rounded-2xl border border-[#E9E2F3] bg-white p-2 sm:flex"
        role="tablist"
      >
        {challengeManagementTabs.map((tab) => {
          const selected = activeTab === tab.value;

          return (
            <button
              aria-selected={selected}
              className={cn(
                "min-h-11 shrink-0 rounded-xl px-4 text-sm font-black transition focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70",
                selected
                  ? "bg-[#7C3AED] text-white shadow-[0_14px_32px_rgba(124,58,237,0.18)]"
                  : "bg-[#F8F4FF] text-[#6F657C] hover:bg-[#F5F3FF] hover:text-[#5B21B6]",
              )}
              key={tab.value}
              onClick={() => onChange?.(tab.value)}
              role="tab"
              type="button"
            >
              {tab.label}
              <span className={cn("ml-2 rounded-full px-2 py-0.5 text-xs", selected ? "bg-white/18" : "bg-white")}>
                {getTabCount(challenges, tab)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
