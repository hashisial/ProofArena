import { Bookmark, BriefcaseBusiness, ClipboardList, Plus, Search, Target, UsersRound } from "lucide-react";
import { createElement } from "react";
import { Card } from "../ui/Card.jsx";
import { ROUTES } from "../../constants/routes.js";

export function WorkspaceQuickActions({ focusChallenge }) {
  const challengeId = focusChallenge?.id || focusChallenge?._id;
  const actions = [
    {
      description: "Define a measurable outcome and open the provider workflow.",
      href: ROUTES.NEW_CHALLENGE,
      icon: Plus,
      label: "Create Challenge",
    },
    {
      description: "Browse providers by proof, skills, offers, and availability.",
      href: ROUTES.PROVIDERS,
      icon: Search,
      label: "Find Providers",
    },
    {
      description: "Review submitted execution plans for the active challenge.",
      href: challengeId ? ROUTES.CHALLENGE_PLANS(challengeId) : ROUTES.MY_CHALLENGES,
      icon: ClipboardList,
      label: "Review Plans",
    },
    {
      description: "Open the challenge-specific provider shortlist.",
      href: challengeId ? ROUTES.CHALLENGE_SHORTLISTED_PROVIDERS(challengeId) : ROUTES.SAVED_PROVIDERS,
      icon: Bookmark,
      label: "View Shortlist",
    },
    {
      description: "Manage every client-owned challenge and workflow status.",
      href: ROUTES.MY_CHALLENGES,
      icon: Target,
      label: "Manage Challenges",
    },
    {
      description: "Return to the operational client command center.",
      href: ROUTES.CLIENT_WORKSPACE,
      icon: BriefcaseBusiness,
      label: "Open Workspace",
    },
  ];

  return (
    <section aria-labelledby="workspace-quick-actions">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">Quick actions</p>
        <h2 id="workspace-quick-actions" className="mt-2 text-2xl font-black tracking-normal text-[#07030D]">
          Move the workflow forward
        </h2>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => (
          <Card as="a" className="block h-full" href={action.href} key={action.label} padding="md" variant="interactive">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#F5F3FF] text-[#7C3AED]">
              {createElement(action.icon || UsersRound, { "aria-hidden": "true", className: "h-5 w-5" })}
            </span>
            <h3 className="mt-4 text-base font-black text-[#07030D]">{action.label}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">{action.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
