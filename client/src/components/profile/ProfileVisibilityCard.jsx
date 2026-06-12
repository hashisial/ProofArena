import { Copy, ExternalLink, Globe2, Lock, ShieldCheck } from "lucide-react";
import { Badge } from "../ui/Badge.jsx";
import { Button } from "../ui/Button.jsx";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/index.js";
import { copyToClipboard } from "../../utils/index.js";

const visibilityMeta = {
  hidden: {
    icon: ShieldCheck,
    label: "Hidden profile",
    text: "Your profile is hidden from public visitors and discovery.",
    variant: "primary",
  },
  private: {
    icon: Lock,
    label: "Private profile",
    text: "Public visitors see a private profile message.",
    variant: "primary",
  },
  public: {
    icon: Globe2,
    label: "Public profile",
    text: "Anyone can view your public ProofArena profile.",
    variant: "green",
  },
};

export function ProfileVisibilityCard({
  profileData = {},
  privacyData,
}) {
  const visibility =
    privacyData?.profileVisibility ??
    profileData.profile?.profileVisibility ??
    profileData.settings?.profileVisibility ??
    "public";
  const meta = visibilityMeta[visibility] ?? visibilityMeta.private;
  const Icon = meta.icon;
  const username = profileData.user?.username;
  const publicUrl =
    typeof window !== "undefined" && username
      ? `${window.location.origin}${ROUTES.PROFILE}/${username}`
      : "";

  async function copyProfileLink() {
    await copyToClipboard(publicUrl);
  }

  return (
    <Card className="rounded-3xl" padding="md">
      <div className="flex items-start gap-3">
        <div
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]"
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-black tracking-[-0.03em] text-[#1C1917]">
              Visibility
            </h2>
            <Badge variant={meta.variant}>{meta.label}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-[#78716C]">{meta.text}</p>
          {publicUrl ? (
            <p className="mt-3 break-all rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] px-3 py-2 text-xs font-bold text-[#44403C]">
              {publicUrl}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-5 grid gap-2">
        <Button disabled={!publicUrl} onClick={copyProfileLink} type="button" variant="outline">
          <Copy aria-hidden="true" className="mr-2 h-4 w-4" />
          Copy profile link
        </Button>
        <Button as="a" href={ROUTES.SETTINGS} variant="secondary">
          <ExternalLink aria-hidden="true" className="mr-2 h-4 w-4" />
          Edit privacy settings
        </Button>
      </div>
    </Card>
  );
}
