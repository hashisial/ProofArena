export const DASHBOARD_ROLE_CONTENT = {
  client: {
    eyebrow: "Client Workspace",
    headline: "Manage projects, providers, messages, and payments without losing context.",
    subtext:
      "A client control room for hiring, tracking delivery, messaging providers, and keeping marketplace payments visible.",
    actions: [
      { href: "/providers", label: "Find Providers" },
      { href: "/projects", label: "Create Project" },
      { href: "/messages", label: "Open Messages" },
    ],
  },
  provider: {
    eyebrow: "Provider Workspace",
    headline: "Run your service business from one focused marketplace dashboard.",
    subtext:
      "Track active work, keep profile credibility sharp, manage payout readiness, and respond to client conversations quickly.",
    actions: [
      { href: "/profile", label: "Complete Profile" },
      { href: "/projects", label: "Review Projects" },
      { href: "/marketplace", label: "Payout Setup" },
    ],
  },
};

export function getDashboardContent(role) {
  return DASHBOARD_ROLE_CONTENT[role] ?? DASHBOARD_ROLE_CONTENT.client;
}
