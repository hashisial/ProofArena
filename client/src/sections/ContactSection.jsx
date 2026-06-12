import { ContactForm } from "../components/ContactForm.jsx";
import { Container } from "../components/Container.jsx";
import { SectionHeading } from "../components/SectionHeading.jsx";

const contactPoints = [
  "Growth plan within one business day",
  "Clear scope before any commitment",
  "Built for leads, revenue, and operational leverage",
];

export function ContactSection({ id = "contact" }) {
  return (
    <section
      id={id}
      className="relative overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="absolute right-[8%] top-20 h-80 w-80 rounded-full bg-[#3F6212]/10 blur-3xl" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <div className="lg:pt-10">
          <SectionHeading
            description="Tell us what you need to improve. The form posts directly to the Express API and stores the inquiry as a lead."
            eyebrow="Contact"
            title="Request a practical growth plan."
          />
          <div className="mt-8 grid gap-3">
            {contactPoints.map((point) => (
              <div
                key={point}
                className="rounded-2xl border border-black/10 bg-white px-4 py-4 text-sm font-medium text-black/58 shadow-[0_18px_55px_rgba(17,17,17,0.05)] transition hover:-translate-y-0.5 hover:border-[#3F6212]/30"
              >
                {point}
              </div>
            ))}
          </div>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}
