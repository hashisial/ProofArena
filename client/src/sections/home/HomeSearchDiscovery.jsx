import { motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button.jsx";
import { Container } from "../../components/Container.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { ROUTES } from "../../constants/index.js";
import { getRevealMotionProps } from "../../utils/motion.js";

const MotionDiv = motion.div;

const quickChips = [
  "Lead Generation",
  "CRM Automation",
  "SaaS Delivery",
  "Customer Support",
  "Virtual Assistance",
  "Website Development",
];

function buildProviderSearchUrl(query) {
  const search = new URLSearchParams();

  if (query.trim()) {
    search.set("search", query.trim());
  }

  return search.toString() ? `${ROUTES.PROVIDERS}?${search.toString()}` : ROUTES.PROVIDERS;
}

function buildProviderCategoryUrl(category) {
  const search = new URLSearchParams();
  search.set("category", category);

  return `${ROUTES.PROVIDERS}?${search.toString()}`;
}

export function HomeSearchDiscovery() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  function handleSubmit(event) {
    event.preventDefault();
    navigate(buildProviderSearchUrl(query));
  }

  return (
    <section className="relative z-10 -mt-8 bg-transparent pb-12 sm:-mt-10 sm:pb-16">
      <Container>
        <MotionDiv {...getRevealMotionProps(reduceMotion, { delay: 0.04 })}>
          <div className="rounded-[2rem] border border-[#EDE9FE] bg-white p-4 shadow-[0_26px_82px_rgba(124, 58, 237, 0.14)] sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <Badge leftIcon={<SlidersHorizontal className="h-4 w-4" />} variant="primary">
                  Marketplace discovery
                </Badge>
                <h2 className="mt-4 break-words text-2xl font-black leading-tight text-[#07030D] sm:text-3xl">
                  Search by outcome, skill, provider, or proof.
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-[#6F657C] sm:text-base">
                  Find providers by what they can deliver - not just what they claim.
                </p>
              </div>
            </div>

            <form className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]" onSubmit={handleSubmit}>
              <Input
                className="min-h-14 rounded-full"
                id="home-marketplace-search"
                label="Search ProofArena"
                leftIcon={<Search className="h-5 w-5" />}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Try lead generation, CRM automation, SaaS delivery..."
                type="search"
                value={query}
              />
              <Button className="mt-0 min-h-14 w-full self-end lg:w-auto" type="submit">
                Search
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {quickChips.map((chip) => (
                <a
                  className="rounded-full border border-[#E9E2F3] bg-[#F8F4FF] px-4 py-2 text-sm font-black text-[#493C5E] transition hover:-translate-y-0.5 hover:border-[#A78BFA] hover:bg-[#F5F3FF] hover:text-[#5B21B6] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70"
                  href={buildProviderCategoryUrl(chip)}
                  key={chip}
                >
                  {chip}
                </a>
              ))}
            </div>
          </div>
        </MotionDiv>
      </Container>
    </section>
  );
}
