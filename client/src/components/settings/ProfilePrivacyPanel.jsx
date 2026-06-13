import { useState } from "react";
import { Eye, Globe2, Lock, Search, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Select } from "../ui/Select.jsx";

const defaultPrivacySettings = Object.freeze({
  allowDiscovery: true,
  allowProviderListing: true,
  allowSearchIndexing: false,
  showActivity: true,
  showEducation: true,
  showEmail: false,
  showExperience: true,
  showOpenTo: true,
  showPhone: false,
  showProofScore: true,
  showServices: true,
  showSocialLinks: true,
  showWebsite: true,
});

const visibilityOptions = [
  {
    label: "Public",
    value: "public",
  },
  {
    label: "Private",
    value: "private",
  },
  {
    label: "Hidden",
    value: "hidden",
  },
];

const visibilityDescriptions = {
  hidden: "Your profile will not appear publicly or in discovery.",
  private: "Only you can view your full profile. Public visitors see a private profile message.",
  public: "Anyone can view your public ProofArena profile.",
};

const groups = [
  {
    icon: Globe2,
    items: [
      ["showEmail", "Show email publicly", "Allow visitors to see your account email."],
      ["showPhone", "Show phone publicly", "Allow visitors to see your phone number."],
      ["showWebsite", "Show website publicly", "Show your website link on public profiles."],
      ["showSocialLinks", "Show social links publicly", "Show public social/profile links."],
    ],
    title: "Contact visibility",
  },
  {
    icon: Eye,
    items: [
      ["showServices", "Show services publicly", "Display active services on your public profile."],
      ["showOpenTo", "Show Open To status publicly", "Display your availability and collaboration interests."],
      ["showExperience", "Show experience publicly", "Display your professional experience section."],
      ["showEducation", "Show education publicly", "Display your education section."],
      ["showActivity", "Show activity publicly", "Display public-safe activity signals."],
      ["showProofScore", "Show proof score publicly", "Display proof score and verified outcome summary."],
    ],
    title: "Section visibility",
  },
  {
    icon: Search,
    items: [
      ["allowDiscovery", "Allow profile discovery", "Allow this profile to appear in platform discovery."],
      ["allowProviderListing", "Allow provider listing", "Allow this profile to appear in provider lists when eligible."],
      ["allowSearchIndexing", "Allow search indexing placeholder", "Prepare this profile for future public search indexing."],
    ],
    title: "Discovery",
  },
];

function normalizePrivacyData(privacyData = {}) {
  return {
    privacySettings: {
      ...defaultPrivacySettings,
      ...(privacyData.privacySettings ?? {}),
    },
    profileVisibility: privacyData.profileVisibility ?? "public",
  };
}

export function ProfilePrivacyPanel({
  isSubmitting = false,
  onSubmit,
  privacyData,
}) {
  const [form, setForm] = useState(() => normalizePrivacyData(privacyData));
  const [error, setError] = useState("");

  function updateToggle(key, checked) {
    setForm((current) => ({
      ...current,
      privacySettings: {
        ...current.privacySettings,
        [key]: checked,
      },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await onSubmit?.(form);
    } catch {
      setError("Privacy settings could not be saved. Please try again.");
    }
  }

  const CurrentIcon =
    form.profileVisibility === "public"
      ? Globe2
      : form.profileVisibility === "private"
        ? Lock
        : ShieldCheck;

  return (
    <Card as="form" className="rounded-3xl" onSubmit={handleSubmit} padding="lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
            Profile privacy
          </p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#1C1917]">
            Control public profile visibility
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#78716C]">
            Control who can see your ProofArena profile, contact details,
            services, and proof reputation.
          </p>
        </div>
        <Badge
          leftIcon={<CurrentIcon className="h-3.5 w-3.5" />}
          variant={form.profileVisibility === "public" ? "green" : "primary"}
        >
          {form.profileVisibility}
        </Badge>
      </div>

      <div className="mt-6 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4">
        <Select
          helperText={visibilityDescriptions[form.profileVisibility]}
          label="Profile visibility"
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              profileVisibility: event.target.value,
            }))
          }
          options={visibilityOptions}
          placeholder=""
          value={form.profileVisibility}
        />
      </div>

      <div className="mt-6 grid gap-5">
        {groups.map((group) => {
          const Icon = group.icon;

          return (
            <section
              className="rounded-2xl border border-[#E7E5E4] bg-white p-4"
              key={group.title}
            >
              <div className="flex items-center gap-3">
                <div
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
                >
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black tracking-[-0.03em] text-[#1C1917]">
                  {group.title}
                </h3>
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {group.items.map(([key, label, description]) => (
                  <Checkbox
                    checked={Boolean(form.privacySettings[key])}
                    description={description}
                    key={key}
                    label={label}
                    onChange={(event) => updateToggle(key, event.target.checked)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {error ? (
        <p className="mt-5 rounded-2xl border border-[#FEE2E2] bg-[#FEF2F2] px-4 py-3 text-sm font-bold text-[#DC2626]">
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button className="w-full sm:w-auto" isLoading={isSubmitting} type="submit">
          Save privacy settings
        </Button>
      </div>
    </Card>
  );
}
