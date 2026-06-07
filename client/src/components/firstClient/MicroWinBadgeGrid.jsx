import { MICRO_WIN_BADGES } from "../../features/firstClient/firstClientUtils.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";
import { MicroWinBadge } from "./MicroWinBadge.jsx";

export function MicroWinBadgeGrid({ badges = [] }) {
  const earnedByKey = new Map((badges ?? []).map((badge) => [badge.key, badge]));

  return (
    <Card variant="bordered">
      <CardHeader>
        <CardTitle>Micro-win badges</CardTitle>
        <CardDescription>
          Lightweight trust milestones for first-client progress. Verified outcome remains locked until proof review exists.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {MICRO_WIN_BADGES.map((badge) => (
          <MicroWinBadge badge={badge} earnedBadge={earnedByKey.get(badge.key)} key={badge.key} />
        ))}
      </CardContent>
    </Card>
  );
}
