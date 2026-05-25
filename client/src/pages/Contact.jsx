import { ContactSection } from "../sections/ContactSection.jsx";
import { PlacedArticles } from "../sections/PlacedArticles.jsx";

export function Contact() {
  return (
    <>
      <section className="relative overflow-hidden bg-white py-20 sm:py-24">
        <div className="absolute right-[8%] top-16 h-72 w-72 rounded-full bg-[#3F6212]/10 blur-3xl" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:px-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#3F6212]">
              Contact
            </p>
            <h1 className="mobile-safe-text mt-5 max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.06em] text-black sm:text-6xl lg:text-7xl">
              Tell us where growth is stuck.
            </h1>
          </div>
          <div className="grid gap-3">
            {["Free growth audit", "Reply within one business day", "Clear scope before commitment"].map((item) => (
              <div className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-bold text-black/62 shadow-[0_18px_50px_rgba(17,17,17,0.05)]" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
      <PlacedArticles placement="contact" title="Helpful reads before you contact us." />
      <ContactSection id={undefined} />
    </>
  );
}
