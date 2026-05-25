import { PageHeader } from "./common/PageHeader.jsx";

const descriptions = {
  Account: "Manage your account, plan, privacy, and workspace preferences.",
  Automation: "Run focused growth and operations tools without leaving the dashboard shell.",
  CRM: "Manage leads, campaigns, and operational records from one controlled workspace.",
  Marketplace: "Review payments, payouts, and billing activity for outcome work.",
  Network: "Manage provider connections and collaboration opportunities.",
  Networking: "Follow platform activity and professional updates.",
  Projects: "Track milestone-based delivery work in a structured workspace.",
  Realtime: "Manage challenge conversations and support chats.",
};

export function SaaSLayout({ children, eyebrow, title }) {
  return (
    <div className="grid min-w-0 gap-6">
      <PageHeader
        backFallback="/dashboard"
        description={descriptions[eyebrow] ?? "Manage this ProofArena workspace module."}
        eyebrow={eyebrow}
        showBack
        title={title}
      />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
