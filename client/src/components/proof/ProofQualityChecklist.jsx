import { CheckCircle2, CircleDashed, CircleX } from "lucide-react";
import { getProofAssetQuality } from "../../utils/proofReadiness.js";
import { Badge } from "../ui/Badge.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card.jsx";

export function ProofQualityChecklist({ asset }) {
  const quality = getProofAssetQuality(asset);

  return (
    <Card as="section" variant="bordered">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>Proof quality checklist</CardTitle>
            <CardDescription>Improve this asset before using it in a client-facing offer or execution plan.</CardDescription>
          </div>
          <Badge variant={quality.score >= 70 ? "green" : "secondary"}>{quality.score}% complete</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-3 sm:grid-cols-2">
          {quality.checks.map((item) => {
            const Icon = item.complete ? CheckCircle2 : CircleX;
            return (
              <li className="rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={item.key}>
                <div className="flex items-start gap-3">
                  <Icon aria-hidden="true" className={`mt-0.5 h-5 w-5 shrink-0 ${item.complete ? "text-[#3F6212]" : "text-[#A16207]"}`} />
                  <div>
                    <p className="text-sm font-black text-[#1C1917]">{item.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#78716C]">{item.description}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#E7E5E4] bg-white p-4">
          <CircleDashed aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#78716C]" />
          <div>
            <p className="text-sm font-black text-[#1C1917]">{quality.verification.label}</p>
            <p className="mt-1 text-sm leading-6 text-[#78716C]">
              Verification remains server-controlled and will be connected to a future review workflow.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
