import { FileCheck2 } from "lucide-react";
import { ROUTES } from "../../constants/index.js";
import { Button } from "../ui/Button.jsx";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/Card.jsx";
import { EmptyState } from "../ui/EmptyState.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export function ProviderProofVaultCard({ assets = [], isError = false, isLoading = false, onRetry, readiness = {}, total }) {
  const usage = readiness?.usage ?? {};
  const topGap = readiness?.suggestedActions?.[0]?.title ?? "Keep proof assets current";

  return (
    <Card className="h-full" padding="lg" variant="bordered">
      <CardHeader>
        <CardTitle>Proof Vault</CardTitle>
        <CardDescription>Reusable evidence, readiness, coverage, and proof workflow usage.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {[0, 1, 2, 3].map((item) => <Skeleton className="h-24" key={item} />)}
          </div>
        ) : isError ? (
          <EmptyState
            actionText="Retry"
            description="Proof Vault data could not be loaded. Try again."
            icon={FileCheck2}
            onAction={onRetry}
            size="sm"
            title="Could not load Proof Vault"
            variant="minimal"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Readiness", `${Number(readiness?.score ?? 0)}/100`],
              ["Total assets", total ?? assets.length],
              ["Public assets", Number(usage.public ?? 0)],
              ["Unused assets", Number(usage.unused ?? 0)],
            ].map(([label, value]) => (
              <div className="rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={label}>
                <p className="text-sm font-bold text-[#78716C]">{label}</p>
                <p className="mt-2 text-2xl font-black text-[#1C1917]">{value}</p>
              </div>
            ))}
          </div>
        )}
        {!isLoading && !isError ? (
          <div className="mt-4 rounded-2xl border border-[#A16207]/20 bg-[#FEF3C7] p-4">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-[#854D0E]">Top proof gap</p>
            <p className="mt-2 text-sm font-black leading-6 text-[#1C1917]">{topGap}</p>
          </div>
        ) : null}
      </CardContent>
      <CardFooter>
        <Button as="a" className="w-full sm:w-auto" href={ROUTES.PROOF_VAULT}>
          <FileCheck2 aria-hidden="true" className="mr-2 h-4 w-4" />
          Open Proof Vault
        </Button>
        <Button as="a" className="w-full sm:w-auto" href={`${ROUTES.PROOF_VAULT}?new=1`} variant="outline">Add Proof Asset</Button>
      </CardFooter>
    </Card>
  );
}
