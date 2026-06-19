import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { ROUTES } from "../constants/index.js";

export function SupportDashboard() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-2">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          Support workspace
        </p>
        <h1 className="text-3xl font-black tracking-tight text-[#1C1917] sm:text-4xl">
          Support Dashboard
        </h1>
        <p className="max-w-3xl text-base font-medium leading-7 text-[#57534E]">
          Review platform activity, help users resolve account issues, and keep ProofArena support
          operations organized as the support workflow expands.
        </p>
      </div>

      <Card className="border-[#E7E5E4] bg-white shadow-[0_24px_80px_rgba(63,98,18,0.10)]">
        <CardHeader>
          <CardTitle as="h2">Support foundation</CardTitle>
          <CardDescription>
            Full support queues, moderation handoffs, and user assistance workflows will connect
            here in later stages. Backend authorization remains the source of truth.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button as={Link} to={ROUTES.NOTIFICATIONS}>
            View Notifications
          </Button>
          <Button as={Link} to={ROUTES.MESSAGES} variant="outline">
            Open Messages
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
