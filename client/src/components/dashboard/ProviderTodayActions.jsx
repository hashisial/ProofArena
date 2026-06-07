import {
  ClipboardList,
  FileCheck2,
  PackagePlus,
  Target,
  UserRoundCheck,
} from "lucide-react";
import { buildProviderActions } from "../../utils/providerActions.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { DashboardActionCard } from "./DashboardActionCard.jsx";

const actionIcons = {
  match: Target,
  offer: PackagePlus,
  opportunity: ClipboardList,
  plan: ClipboardList,
  profile: UserRoundCheck,
  proof: FileCheck2,
  shortlist: ClipboardList,
};

export function ProviderTodayActions({ data = {} }) {
  const actions = buildProviderActions(data);

  return (
    <Card as="section" aria-labelledby="provider-today-actions-title" padding="lg" variant="elevated">
      <CardHeader>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#7C3AED]">Today</p>
          <CardTitle as="h2" className="mt-2 text-2xl" id="provider-today-actions-title">
            Today&apos;s Action Plan
          </CardTitle>
          <CardDescription>
            Prioritized from your profile, offers, proof, matches, plans, and due opportunity actions.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.length > 0 ? actions.map((action) => (
          <DashboardActionCard
            {...action}
            href={action.route}
            icon={actionIcons[action.icon]}
            key={action.title}
          />
        )) : (
          <EmptyState
            description="You're in good shape. Keep checking matched challenges and opportunities."
            icon={Target}
            size="sm"
            title="No urgent provider actions"
            variant="minimal"
          />
        )}
      </CardContent>
    </Card>
  );
}
