import { ArrowRight, BadgeCheck, Target, UserRoundCheck } from "lucide-react";
import { Button } from "../../../components/Button.jsx";
import { Container } from "../../../components/Container.jsx";
import { ROUTES } from "../../../constants/index.js";

export function ProofArenaFinalCTA() {
  return (
    <section className="bg-[#FEFCE8] py-20 sm:py-28 lg:py-36">
      <Container>
        <div className="border border-[#3F6212]/20 bg-[#3F6212] px-5 py-12 text-white shadow-[0_30px_90px_rgba(63,98,18,0.24)] sm:px-10 lg:px-14 lg:py-16" data-story-reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-xs font-black uppercase text-[#ECFCCB]">
                <BadgeCheck aria-hidden="true" className="h-4 w-4" />
                The future of outcome work
              </div>
              <h2 className="mt-6 text-4xl font-black leading-[1.02] [text-wrap:balance] sm:text-6xl lg:text-7xl">
                Stop hiring promises.
                <span className="mt-2 block text-[#ECFCCB]">Start verifying outcomes.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-white/68 sm:text-lg">
                Build the challenge, compare the plan, verify the proof, and let reputation
                follow the result. Join the outcome economy from the side that fits your work.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[20rem] lg:grid-cols-1">
              <Button
                as="a"
                className="w-full border-white bg-white text-[#3F6212] hover:border-[#ECFCCB] hover:bg-[#ECFCCB] hover:text-[#365314]"
                href={ROUTES.REGISTER}
                variant="secondary"
              >
                <Target aria-hidden="true" className="mr-2 h-4 w-4" />
                Create Challenge
                <ArrowRight aria-hidden="true" className="ml-2 h-4 w-4" />
              </Button>
              <Button
                as="a"
                className="w-full border-white/25 bg-white/10 text-white hover:border-white/45 hover:bg-white/15 hover:text-white"
                href={ROUTES.REGISTER}
                variant="secondary"
              >
                <UserRoundCheck aria-hidden="true" className="mr-2 h-4 w-4" />
                Become a Provider
              </Button>
              <p className="text-center text-xs font-semibold leading-5 text-white/52">
                No proposal race. No fake trust signals. Start with the outcome.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
