import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";

export function CTASection() {
  return (
    <section className="bg-[#12091F] py-20 sm:py-24 lg:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-[1.75rem] border border-black/10 bg-black p-5 text-white shadow-[0_36px_110px_rgba(109,40,217,0.24)] sm:rounded-[2.5rem] sm:p-12 lg:p-16">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#7C3AED]/40 blur-3xl" />
          <div className="absolute bottom-0 right-16 h-px w-1/2 bg-gradient-to-r from-transparent via-[#A78BFA] to-transparent" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
              Conversion sprint
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-[1] tracking-[-0.052em] text-white sm:text-6xl sm:leading-[0.98] sm:tracking-[-0.065em]">
              Ready to make growth feel less improvised?
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/62">
              Share the bottleneck. We will map the fastest path to leads,
              automation, support coverage, or a scalable build.
            </p>
          </div>
          <div className="relative mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button as="a" href="/contact">
              Get Free Consultation
            </Button>
            <Button as="a" href="/services" variant="secondary">
              Explore Services
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
