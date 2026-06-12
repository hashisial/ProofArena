import { Flag, ShieldAlert } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { formatDate } from "../../utils/formatDate.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { AdminStatusBadge } from "./AdminStatusBadge.jsx";

const resourceRoutes = Object.freeze({
  challenge: ROUTES.ADMIN_CHALLENGES,
  "outcome-offer": ROUTES.ADMIN_OFFERS,
  "proof-asset": ROUTES.ADMIN_PROOF_ASSETS,
  provider: ROUTES.ADMIN_PROVIDERS,
});

function getItemTitle(item) {
  return item.title || item.headline || item.provider?.displayName || "Moderation item";
}

export function AdminModerationQueue({ items = [] }) {
  return (
    <Card variant="bordered">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Moderation queue</CardTitle>
            <CardDescription>Pending and flagged records requiring an admin decision.</CardDescription>
          </div>
          <ShieldAlert aria-hidden="true" className="h-5 w-5 shrink-0 text-[#A16207]" />
        </div>
      </CardHeader>
      <div className="mt-5">
        {items.length ? (
          <div className="divide-y divide-[#E7E5E4]">
            {items.map((item) => (
              <div className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between" key={`${item.resourceType}-${item.id}`}>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-black text-[#1C1917]">{getItemTitle(item)}</p>
                    <AdminStatusBadge status={item.moderation?.status} />
                  </div>
                  <p className="mt-1 text-xs font-bold uppercase tracking-[0.1em] text-[#78716C]">
                    {item.resourceType?.replaceAll("-", " ")} · {formatDate(item.updatedAt)}
                  </p>
                </div>
                <Button as="a" className="w-full sm:w-auto" href={resourceRoutes[item.resourceType]} variant="secondary">
                  Review
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            description="Pending and flagged records will appear here when moderation is required."
            icon={Flag}
            size="sm"
            title="No moderation items"
            variant="minimal"
          />
        )}
      </div>
    </Card>
  );
}
