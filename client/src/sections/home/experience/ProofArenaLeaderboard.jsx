import { ArrowRight, BadgeCheck, Medal, ShieldCheck, Timer, Trophy } from "lucide-react";
import { Button } from "../../../components/Button.jsx";
import { Container } from "../../../components/Container.jsx";
import { Badge } from "../../../components/ui/Badge.jsx";
import { ROUTES } from "../../../constants/index.js";

const leaderboardRows = [
  {
    approval: "98%",
    label: "Growth systems provider",
    outcomes: "28",
    proofScore: "96",
    reliability: "96%",
  },
  {
    approval: "95%",
    label: "Support operations team",
    outcomes: "21",
    proofScore: "93",
    reliability: "94%",
  },
  {
    approval: "94%",
    label: "SaaS delivery specialist",
    outcomes: "17",
    proofScore: "91",
    reliability: "92%",
  },
];

const rankingSignals = [
  { icon: BadgeCheck, label: "Approved proof" },
  { icon: Trophy, label: "Completed outcomes" },
  { icon: Timer, label: "Reliable delivery" },
  { icon: ShieldCheck, label: "Verified reputation" },
];

export function ProofArenaLeaderboard() {
  return (
    <section className="bg-[#FEFCE8] py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="grid gap-12 xl:grid-cols-[0.62fr_1.38fr] xl:items-start">
          <div data-story-reveal>
            <p className="text-xs font-black uppercase text-[#A16207]">09 / Leaderboard</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.03] text-[#1C1917] [text-wrap:balance] sm:text-5xl lg:text-6xl">
              Visibility earned through execution.
            </h2>
            <p className="mt-5 max-w-xl text-base font-semibold leading-8 text-[#57534E]">
              Proof-backed rankings make strong operators easier to discover without paid boosts,
              proposal volume, or popularity contests.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#D6D3D1] bg-[#D6D3D1]">
              {rankingSignals.map((signal) => {
                const Icon = signal.icon;

                return (
                  <div className="flex min-w-0 items-center gap-3 bg-[#FFFFFF] p-4" key={signal.label}>
                    <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-[#3F6212]" />
                    <span className="text-xs font-black leading-5 text-[#1C1917]">{signal.label}</span>
                  </div>
                );
              })}
            </div>
            <Button as="a" className="mt-8 w-full sm:w-auto" href={ROUTES.LEADERBOARD}>
              Explore leaderboard
              <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="border border-[#D6D3D1] bg-white shadow-[0_28px_80px_rgba(28,25,23,0.08)]" data-story-reveal>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E7E5E4] px-5 py-5 sm:px-7">
              <div>
                <p className="text-sm font-black text-[#1C1917]">Proof-based provider ranking</p>
                <p className="mt-1 text-xs font-semibold text-[#78716C]">
                  Generic preview data. Live ranking connects through the existing leaderboard route.
                </p>
              </div>
              <Badge leftIcon={<Medal className="h-4 w-4" />} variant="secondary">
                Leaderboard preview
              </Badge>
            </div>

            <div className="hidden grid-cols-[4rem_minmax(0,1fr)_6rem_6rem_6rem_6rem] gap-4 border-b border-[#E7E5E4] bg-[#1C1917] px-7 py-3 text-[0.65rem] font-black uppercase text-white/60 lg:grid">
              <span>Rank</span>
              <span>Provider type</span>
              <span>Proof</span>
              <span>Outcomes</span>
              <span>Approval</span>
              <span>On time</span>
            </div>

            <div className="divide-y divide-[#E7E5E4]">
              {leaderboardRows.map((row, index) => (
                <article
                  className="grid gap-5 px-5 py-6 transition-colors hover:bg-[#FFFFFF] sm:px-7 lg:grid-cols-[4rem_minmax(0,1fr)_6rem_6rem_6rem_6rem] lg:items-center lg:gap-4"
                  key={row.label}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center border text-sm font-black ${
                        index === 0
                          ? "border-[#A16207] bg-[#A16207] text-white"
                          : "border-[#D6D3D1] bg-[#F5F5F4] text-[#3F6212]"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="text-xs font-black uppercase text-[#78716C] lg:hidden">Rank</span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-black leading-6 text-[#1C1917]">{row.label}</h3>
                    <p className="mt-1 text-xs font-semibold text-[#78716C]">Proof-backed provider preview</p>
                  </div>
                  {[
                    ["Proof", row.proofScore],
                    ["Outcomes", row.outcomes],
                    ["Approval", row.approval],
                    ["On time", row.reliability],
                  ].map(([label, value]) => (
                    <div className="flex items-center justify-between gap-3 border-t border-[#E7E5E4] pt-3 lg:block lg:border-0 lg:pt-0" key={label}>
                      <p className="text-[0.65rem] font-black uppercase text-[#78716C] lg:hidden">{label}</p>
                      <p className={`text-sm font-black ${label === "Proof" ? "text-[#3F6212]" : "text-[#1C1917]"}`}>{value}</p>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
