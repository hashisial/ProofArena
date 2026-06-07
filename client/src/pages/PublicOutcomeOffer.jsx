import { Link, useParams } from "react-router-dom";
import { UserRound } from "lucide-react";
import { OutcomeOfferPreview } from "../components/outcomeOffers/OutcomeOfferPreview.jsx";
import { Badge } from "../components/ui/Badge.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { PageLoader } from "../components/ui/PageLoader.jsx";
import { Container } from "../components/Container.jsx";
import { ROUTES } from "../constants/index.js";
import { usePublicOutcomeOffer } from "../features/outcomeOffers/useOutcomeOffers.js";
import { getApiErrorMessage } from "../features/outcomeOffers/outcomeOfferUtils.js";

export function PublicOutcomeOffer() {
  const { slug, username } = useParams();
  const offerQuery = usePublicOutcomeOffer(username, slug);
  const offer = offerQuery.data;
  const provider = offer?.provider ?? {};

  if (offerQuery.isLoading) {
    return <PageLoader description="Loading proof-based offer details." title="Loading outcome offer" />;
  }

  if (offerQuery.isError || !offer) {
    return (
      <section className="bg-[#FBF9FF] py-12">
        <Container>
          <Card className="mx-auto max-w-3xl" padding="lg" variant="bordered">
            <Badge variant="secondary">Offer unavailable</Badge>
            <h1 className="mt-3 text-3xl font-black text-[#07030D]">Outcome offer could not be loaded</h1>
            <p className="mt-2 text-sm leading-6 text-[#6F657C]">
              {getApiErrorMessage(offerQuery.error, "This offer may be private, archived, or not ready for public viewing.")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button as={Link} to={ROUTES.PROVIDERS}>Explore Providers</Button>
              <Button as={Link} to={ROUTES.HOME} variant="secondary">Go Home</Button>
            </div>
          </Card>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-[#FBF9FF] py-8 text-[#07030D] sm:py-12">
      <Container>
        <div className="mx-auto grid max-w-6xl gap-6">
          <Card className="rounded-3xl" padding="lg" variant="elevated">
            <Badge variant="primary">Outcome offer</Badge>
            <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-normal text-[#07030D] sm:text-5xl">
              {offer.title}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#6F657C]">{offer.shortSummary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#7C3AED] text-white">
                <UserRound aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-black text-[#07030D]">{provider.fullName || "ProofArena provider"}</p>
                <p className="text-sm font-semibold text-[#6F657C]">{provider.headline || provider.title || "Proof-backed provider"}</p>
              </div>
              {provider.username ? (
                <Button as={Link} className="ml-auto w-full sm:w-auto" to={`/profile/${provider.username}`} variant="secondary">
                  View provider profile
                </Button>
              ) : null}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
            <OutcomeOfferPreview offer={offer} />
            <Card padding="lg" variant="default">
              <h2 className="text-2xl font-black text-[#07030D]">Interested in this outcome?</h2>
              <p className="mt-2 text-sm leading-6 text-[#6F657C]">
                Client challenge invitations are a later workflow. For now, join ProofArena or create a challenge foundation.
              </p>
              <div className="mt-6 grid gap-3">
                <Button as={Link} to={ROUTES.REGISTER}>Invite provider to challenge</Button>
                <Button as={Link} to={ROUTES.CHALLENGES} variant="outline">Explore challenges</Button>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}
