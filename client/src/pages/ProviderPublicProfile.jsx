import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { Container } from "../components/Container.jsx";
import { ErrorState } from "../components/ErrorState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import { useAuth } from "../hooks/useAuth.js";
import {
  connectWithProvider,
  deleteSavedItem,
  getSavedItems,
  getProviderReviews,
  getProviderPublicProfile,
  saveItem,
  startConversation,
} from "../services/api.js";
import { getRealtimeBaseUrl } from "../services/apiClient.js";
import { getInitials } from "../utils/index.js";

const MotionDiv = motion.div;
const MotionSection = motion.section;

const socialLabels = {
  github: "GitHub",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  twitter: "X",
};

function getApiAssetUrl(value) {
  const source = String(value ?? "");

  if (!source.startsWith("/uploads/")) {
    return source;
  }

  return `${getRealtimeBaseUrl()}${source}`;
}

function getDisplayLabel(value = "") {
  return String(value || "Not listed")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getSafeUrl(value) {
  const source = String(value ?? "").trim();

  if (!source) {
    return "";
  }

  try {
    const url = new URL(source);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function formatMoney(value, suffix = "") {
  const amount = Number(value);

  if (!Number.isFinite(amount) || amount <= 0) {
    return "Custom";
  }

  return `$${amount.toLocaleString()}${suffix}`;
}

function formatCompactNumber(value) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    return "0";
  }

  if (numberValue >= 1000) {
    return `${(numberValue / 1000).toFixed(numberValue >= 10_000 ? 0 : 1)}k`;
  }

  return numberValue.toLocaleString();
}

function formatResponseTime(value) {
  const responseTime = String(value || "Usually responds within 24 hours").trim();

  return responseTime
    .replace(/^usually responds within\s*/i, "< ")
    .replace(/^responds within\s*/i, "< ");
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path d="m10 1.7 2.34 5.03 5.5.68-4.05 3.78 1.06 5.44L10 13.94l-4.85 2.69 1.06-5.44-4.05-3.78 5.5-.68L10 1.7Z" />
    </svg>
  );
}

function ProviderAvatar({ avatar, name }) {
  const source = getApiAssetUrl(avatar);

  if (source) {
    return (
      <img
        alt={`${name} avatar`}
        className="h-32 w-32 rounded-[2rem] border-4 border-white object-cover shadow-[0_26px_70px_rgba(63, 98, 18, 0.2)] sm:h-40 sm:w-40"
        src={source}
      />
    );
  }

  return (
    <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-white bg-black text-3xl font-black text-white shadow-[0_26px_70px_rgba(63, 98, 18, 0.2)] sm:h-40 sm:w-40">
      {getInitials(name)}
    </div>
  );
}

function CoverVisual({ coverImage }) {
  const source = getApiAssetUrl(coverImage);

  return (
    <div className="relative min-h-[19rem] overflow-hidden rounded-[2.35rem] bg-[#1A2E05] sm:min-h-[25rem]">
      {source ? (
        <img alt="" className="h-full min-h-[19rem] w-full object-cover sm:min-h-[25rem]" src={source} />
      ) : (
        <div className="h-full min-h-[19rem] bg-[radial-gradient(circle_at_17%_16%,rgba(101,163,13,0.58),transparent_15rem),radial-gradient(circle_at_80%_24%,rgba(63,98,18,0.46),transparent_16rem),linear-gradient(135deg,#1C1917,#365314_52%,#3F6212)] sm:min-h-[25rem]" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/8 to-transparent" />
      <MotionDiv
        animate={{ rotate: 360, y: [0, -12, 0] }}
        className="absolute right-8 top-8 h-24 w-24 rounded-[1.8rem] border border-white/18 bg-white/10 backdrop-blur-xl"
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      />
      <MotionDiv
        animate={{ rotate: -360, x: [0, 16, 0] }}
        className="absolute bottom-10 left-[42%] hidden h-14 w-14 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl sm:block"
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      />
    </div>
  );
}

function StatBlock({ emphasized = false, label, note, value }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.25rem] border p-4 transition duration-300 hover:-translate-y-0.5 ${
        emphasized
          ? "border-black bg-black text-white shadow-[0_24px_70px_rgba(0,0,0,0.16)]"
          : "border-black/10 bg-white text-black shadow-[0_16px_44px_rgba(63, 98, 18, 0.06)] hover:border-[#3F6212]/35 hover:shadow-[0_22px_60px_rgba(63, 98, 18, 0.13)]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-4 top-0 h-px w-12 ${
          emphasized ? "bg-[#65A30D]" : "bg-[#3F6212]"
        }`}
      />
      <p
        className={`text-[0.66rem] font-black uppercase tracking-[0.18em] ${
          emphasized ? "text-white/48" : "text-black/42"
        }`}
      >
        {label}
      </p>
      <p className="mt-3 text-2xl font-black tracking-[-0.06em] sm:text-3xl">{value}</p>
      {note ? (
        <p
          className={`mt-1 text-xs font-bold leading-5 ${
            emphasized ? "text-white/52" : "text-black/42"
          }`}
        >
          {note}
        </p>
      ) : null}
    </div>
  );
}

function ProviderStatsStrip({ stats }) {
  const items = [
    {
      emphasized: true,
      label: "Avg rating",
      note: `${formatCompactNumber(stats.totalReviews)} reviews`,
      value: Number(stats.averageRating ?? stats.rating ?? 0).toFixed(1),
    },
    {
      label: "Services",
      note: "Live offers",
      value: formatCompactNumber(stats.totalServices ?? stats.activeServices),
    },
    {
      label: "Completed",
      note: "Projects",
      value: formatCompactNumber(stats.completedProjects),
    },
    {
      label: "Response",
      note: "Placeholder",
      value: formatResponseTime(stats.responseTime),
    },
    {
      label: "Profile views",
      note: "Public visits",
      value: formatCompactNumber(stats.profileViews),
    },
    {
      label: "Service views",
      note: "All active services",
      value: formatCompactNumber(stats.serviceViews),
    },
    {
      label: "Orders",
      note: "Marketplace",
      value: formatCompactNumber(stats.totalOrders),
    },
  ];

  return (
    <div className="border-t border-black/10 px-2 pt-6 sm:px-4 lg:px-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {items.map((item) => (
          <StatBlock
            emphasized={item.emphasized}
            key={item.label}
            label={item.label}
            note={item.note}
            value={item.value}
          />
        ))}
      </div>
    </div>
  );
}

function SectionShell({ children, eyebrow, title }) {
  return (
    <MotionSection
      className="rounded-[2rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)] sm:p-8"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-80px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black leading-[1.02] tracking-[-0.055em] text-black sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </MotionSection>
  );
}

function SkillCloud({ skills = [] }) {
  if (!skills.length) {
    return <p className="text-sm font-medium text-black/54">No skills listed yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {skills.map((skill, index) => (
        <span
          className={`rounded-full px-4 py-2 text-sm font-black shadow-[0_14px_34px_rgba(63, 98, 18, 0.16)] ${
            index % 5 === 0
              ? "bg-black text-white"
              : "border border-[#3F6212]/16 bg-[#3F6212]/8 text-[#365314]"
          }`}
          key={skill}
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function InfoList({ items }) {
  return (
    <div className="grid gap-3">
      {items.map(([label, value]) => (
        <div className="rounded-[1.25rem] border border-black/10 bg-[#fffbeb] p-4" key={label}>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-black/42">{label}</p>
          <p className="mt-2 break-words text-sm font-black text-black">{value || "Not listed"}</p>
        </div>
      ))}
    </div>
  );
}

function SocialLinks({ socialLinks = {} }) {
  const links = Object.entries(socialLinks)
    .map(([key, value]) => [key, getSafeUrl(value)])
    .filter(([, href]) => href);

  if (!links.length) {
    return <p className="text-sm leading-6 text-black/54">No public social links yet.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map(([key, href]) => (
        <a
          className="rounded-full border border-[#3F6212]/18 bg-white px-4 py-2 text-sm font-black text-[#365314] transition duration-300 hover:-translate-y-0.5 hover:bg-[#3F6212] hover:text-white hover:shadow-[0_18px_44px_rgba(63, 98, 18, 0.2)]"
          href={href}
          key={key}
          rel="noreferrer"
          target="_blank"
        >
          {socialLabels[key] ?? getDisplayLabel(key)}
        </a>
      ))}
    </div>
  );
}

function ServiceCard({ service }) {
  const image = getApiAssetUrl(service.coverImage || service.images?.[0]);
  const price =
    service.pricingType === "hourly"
      ? formatMoney(service.hourlyRate || service.price, "/hr")
      : formatMoney(service.fixedPrice || service.price);

  return (
    <a
      className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-[#fffbeb] transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/40 hover:bg-white hover:shadow-[0_26px_80px_rgba(63, 98, 18, 0.16)]"
      href={`/marketplace/service/${service.slug || service._id}`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1A2E05]">
        {image ? (
          <img alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={image} />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_18%,rgba(101, 163, 13, 0.58),transparent_12rem),linear-gradient(135deg,#1C1917,#365314)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-black">
            {getDisplayLabel(service.category)}
          </span>
          <span className="rounded-full border border-white/18 bg-black/45 px-3 py-1.5 text-xs font-black text-white backdrop-blur-xl">
            {price}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-black leading-[1.04] tracking-[-0.055em] text-black">
          {service.title}
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-bold text-black/58">
            {service.deliveryTime || "Scoped"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-[#3F6212]/14 bg-[#3F6212]/8 px-3 py-1.5 text-xs font-bold text-[#365314]">
            <StarIcon />
            {Number(service.ratingAverage ?? 0).toFixed(1)}
          </span>
        </div>
      </div>
    </a>
  );
}

function PortfolioCard({ item }) {
  const image = getApiAssetUrl(item.image);

  return (
    <article className="group overflow-hidden rounded-[1.6rem] border border-black/10 bg-[#fffbeb] transition duration-300 hover:-translate-y-1 hover:border-[#3F6212]/40 hover:bg-white hover:shadow-[0_26px_80px_rgba(63, 98, 18, 0.16)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#1A2E05]">
        {image ? (
          <img alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" src={image} />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_20%_18%,rgba(101, 163, 13, 0.58),transparent_12rem),linear-gradient(135deg,#1C1917,#365314)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/76 via-black/10 to-transparent" />
        <span className="absolute bottom-4 left-4 rounded-full bg-white px-3 py-1.5 text-xs font-black text-black">
          {item.industry || "Case study"}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-2xl font-black leading-[1.04] tracking-[-0.055em] text-black">
          {item.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm font-medium leading-6 text-black/58">
          {item.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {(item.results ?? []).slice(0, 3).map((result) => (
            <span className="rounded-full bg-[#3F6212] px-3 py-1.5 text-xs font-black text-white" key={result}>
              {result}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function VerifiedBadge({ className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-[#3F6212]/18 bg-[#3F6212] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-white shadow-[0_14px_34px_rgba(63, 98, 18, 0.2)] ${className}`}>
      <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
        <path d="m5 12 4 4L19 6.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </svg>
      Verified
    </span>
  );
}

function ReviewsPlaceholder({ reviews = [], stats }) {
  const hasReviews = reviews.length > 0;

  return (
    <SectionShell eyebrow="Reviews" title={hasReviews ? "Verified project feedback." : "Verified project feedback will appear here."}>
      <div className="grid gap-4 lg:grid-cols-[0.72fr_1fr]">
        <div className="rounded-[1.5rem] bg-black p-6 text-white">
          <div className="flex gap-1 text-[#65A30D]">
            {[0, 1, 2, 3, 4].map((index) => (
              <StarIcon key={index} />
            ))}
          </div>
          <p className="mt-4 text-5xl font-black tracking-[-0.07em]">
            {Number(stats.rating ?? 0).toFixed(1)}
          </p>
          <p className="mt-2 text-sm font-semibold text-white/58">
            {stats.totalReviews ?? 0} marketplace reviews
          </p>
        </div>
        {hasReviews ? (
          <div className="grid gap-3">
            {reviews.slice(0, 3).map((review) => (
              <article className="rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-5" key={review._id}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-black tracking-[-0.035em] text-black">
                    {review.heading || "Client feedback"}
                  </p>
                  <span className="rounded-full bg-[#3F6212] px-3 py-1 text-xs font-black text-white">
                    {Number(review.rating ?? review.stars ?? 5).toFixed(1)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-black/62">{review.comment || review.description}</p>
                <p className="mt-4 text-xs font-black uppercase tracking-[0.14em] text-black/38">
                  {review.authorName || "Verified client"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-black/10 bg-[#fffbeb] p-6">
            <p className="text-lg font-black tracking-[-0.035em] text-black">
              Review collection is ready for completed projects.
            </p>
            <p className="mt-3 text-sm leading-7 text-black/62">
              Once projects close, this section can show communication quality,
              delivery quality, client quotes, and project outcomes.
            </p>
          </div>
        )}
      </div>
    </SectionShell>
  );
}

export function ProviderPublicProfile({ username }) {
  const queryClient = useQueryClient();
  const { isAuthenticated, role } = useAuth();
  const [connectMessage, setConnectMessage] = useState("");
  const canSave = isAuthenticated && role === "client";
  const normalizedUsername = decodeURIComponent(username ?? "")
    .replace(/^\/+|\/+$/g, "")
    .trim()
    .toLowerCase();
  const { data, error, isError, isLoading } = useQuery({
    enabled: Boolean(normalizedUsername),
    queryFn: () => getProviderPublicProfile(normalizedUsername),
    queryKey: ["provider-public-profile", normalizedUsername],
    staleTime: 60_000,
  });
  const { data: savedItems = [] } = useQuery({
    enabled: canSave,
    queryFn: getSavedItems,
    queryKey: ["saved-items"],
    staleTime: 20_000,
  });
  const providerIdForReviews = data?.user?._id;
  const { data: providerReviews = [] } = useQuery({
    enabled: Boolean(providerIdForReviews),
    queryFn: () => getProviderReviews(providerIdForReviews),
    queryKey: ["reviews", "provider", providerIdForReviews],
    staleTime: 60_000,
  });
  const contactMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      return startConversation(data?.user?._id);
    },
    onSuccess: (conversation) => {
      if (conversation) {
        window.location.href = `/messages?conversation=${encodeURIComponent(conversation._id)}`;
      }
    },
  });
  const connectMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      return connectWithProvider(normalizedUsername);
    },
    onSuccess: (connection) => {
      if (connection) {
        setConnectMessage(
          connection.status === "accepted"
            ? "You are already connected."
            : "Connection request sent.",
        );
      }
    },
  });
  const saveProviderMutation = useMutation({
    mutationFn: async () => {
      if (!isAuthenticated) {
        window.location.href = "/login";
        return null;
      }

      if (role !== "client") {
        throw new Error("Only client accounts can save providers.");
      }

      const providerId = data?.user?._id;
      const savedItem = savedItems.find(
        (item) => item.itemType === "provider" && item.providerId === providerId,
      );

      if (savedItem) {
        return deleteSavedItem(savedItem._id);
      }

      return saveItem({
        itemType: "provider",
        providerId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-items"] });
      setConnectMessage("Saved list updated.");
    },
  });
  const user = data?.user ?? {};
  const profile = data?.profile ?? {};
  const providerProfile = data?.providerProfile ?? {};
  const stats = data?.stats ?? {};
  const services = data?.activeServices ?? [];
  const portfolioItems = data?.portfolioItems ?? [];
  const displayName = user.fullName || user.name || user.username || "Provider";
  const savedProviderItem = savedItems.find(
    (item) => item.itemType === "provider" && item.providerId === user._id,
  );
  const avatar = getApiAssetUrl(user.avatar || profile.profilePicture);
  const headline = providerProfile.title || profile.headline || "Verified marketplace provider";
  const isVerified =
    providerProfile.verificationStatus === "verified" ||
    user.verificationStatus === "verified" ||
    user.isVerified;
  const allSkills = useMemo(
    () =>
      Array.from(
        new Set([
          ...(providerProfile.skills ?? []),
          ...(profile.skills ?? []),
          ...(providerProfile.categories ?? []),
        ]),
      ),
    [profile.skills, providerProfile.categories, providerProfile.skills],
  );

  return (
    <section className="relative isolate overflow-hidden bg-white py-12 text-black sm:py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_16%_16%,rgba(63,98,18,0.18),transparent_19rem),radial-gradient(circle_at_82%_12%,rgba(101,163,13,0.22),transparent_18rem),linear-gradient(180deg,#FEFCE8_0%,#ffffff_74%)]" />
        <MotionDiv
          animate={{ rotate: 360, y: [0, -14, 0] }}
          className="absolute right-[7%] top-28 h-36 w-36 rounded-[2rem] border border-[#3F6212]/14 bg-[#3F6212]/8"
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        />
        <MotionDiv
          animate={{ rotate: -360, x: [0, 18, 0] }}
          className="absolute left-[5%] top-[38rem] h-28 w-28 rounded-full border border-[#65A30D]/20 bg-white shadow-[0_26px_80px_rgba(63, 98, 18, 0.14)]"
          transition={{ duration: 34, ease: "linear", repeat: Infinity }}
        />
      </div>

      <Container className="relative z-10">
        {isLoading ? <LoadingState columns={3} /> : null}
        {isError ? (
          <ErrorState
            message={error?.message ?? "This provider profile is unavailable."}
            title="Provider could not be loaded"
          />
        ) : null}

        {!isLoading && data ? (
          <div className="grid gap-10">
            <MotionSection
              className="rounded-[2.7rem] border border-[#3F6212]/14 bg-white p-4 shadow-[0_34px_110px_rgba(63, 98, 18, 0.12)] sm:p-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <CoverVisual coverImage={profile.coverImage} />
              <div className="relative grid gap-7 px-2 pb-4 pt-0 sm:px-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end lg:px-6">
                <div className="-mt-16 flex flex-col gap-5 sm:-mt-20 sm:flex-row sm:items-end">
                  <ProviderAvatar avatar={avatar} name={displayName} />
                  <div className="pb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#3F6212] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_18px_46px_rgba(63, 98, 18, 0.26)]">
                        {getDisplayLabel(stats.availability)}
                      </span>
                      {isVerified ? <VerifiedBadge /> : null}
                      <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black/54">
                        {getDisplayLabel(user.accountType)}
                      </span>
                    </div>
                    <h1 className="mt-6 max-w-5xl text-5xl font-black leading-[0.92] tracking-[-0.08em] text-black sm:text-6xl lg:text-7xl">
                      {displayName}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base font-semibold leading-8 text-black/64 sm:text-lg">
                      {headline}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-[0.14em]">
                      {profile.location ? (
                        <span className="rounded-full border border-black/10 bg-[#fffbeb] px-3 py-1.5 text-black/58">
                          {profile.location}
                        </span>
                      ) : null}
                      <span className="rounded-full border border-black/10 bg-[#fffbeb] px-3 py-1.5 text-black/58">
                        @{user.username}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-[1.6rem] border border-black/10 bg-[#fffbeb] p-4">
                  <Button
                    isLoading={contactMutation.isPending}
                    loadingLabel="Opening chat..."
                    onClick={() => contactMutation.mutate()}
                  >
                    Message Provider
                  </Button>
                  <Button
                    isLoading={connectMutation.isPending}
                    loadingLabel="Sending..."
                    onClick={() => connectMutation.mutate()}
                    variant="secondary"
                  >
                    Connect
                  </Button>
                  <Button
                    isLoading={saveProviderMutation.isPending}
                    loadingLabel="Saving..."
                    onClick={() => saveProviderMutation.mutate()}
                    variant={savedProviderItem ? "outline" : "secondary"}
                  >
                    {savedProviderItem ? "Remove saved" : "Save provider"}
                  </Button>
                  <Button as="a" href={`/marketplace?providerId=${user._id}`} variant="outline">
                    View services
                  </Button>
                  {(contactMutation.isError || connectMutation.isError || saveProviderMutation.isError || connectMessage) ? (
                    <div className="grid gap-2">
                      {contactMutation.isError ? (
                        <StatusBanner tone="error">{contactMutation.error?.message}</StatusBanner>
                      ) : null}
                      {connectMutation.isError ? (
                        <StatusBanner tone="error">{connectMutation.error?.message}</StatusBanner>
                      ) : null}
                      {saveProviderMutation.isError ? (
                        <StatusBanner tone="error">{saveProviderMutation.error?.message}</StatusBanner>
                      ) : null}
                      {connectMessage ? <StatusBanner tone="success">{connectMessage}</StatusBanner> : null}
                    </div>
                  ) : null}
                </div>
              </div>

              <ProviderStatsStrip stats={stats} />
            </MotionSection>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
              <aside className="grid content-start gap-5 lg:sticky lg:top-24">
                <section className="rounded-[1.8rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">
                    Snapshot
                  </p>
                  <div className="mt-5">
                    <InfoList
                      items={[
                        ["Location", profile.location],
                        ["Availability", getDisplayLabel(providerProfile.availability)],
                        ["Experience", getDisplayLabel(providerProfile.experienceLevel)],
                        ["Starting price", formatMoney(stats.startingPrice)],
                        ["Languages", (providerProfile.languages ?? []).join(", ")],
                      ]}
                    />
                  </div>
                </section>

                <section className="rounded-[1.8rem] border border-[#3F6212]/14 bg-white p-6 shadow-[0_22px_70px_rgba(63, 98, 18, 0.08)]">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#3F6212]">
                    Social
                  </p>
                  <div className="mt-5">
                    <SocialLinks socialLinks={profile.socialLinks} />
                  </div>
                </section>
              </aside>

              <main className="grid min-w-0 gap-8">
                <SectionShell eyebrow="About" title="How this provider works.">
                  <p className="max-w-3xl text-base font-medium leading-8 text-black/64">
                    {profile.bio ||
                      "This provider has not added a full about section yet. Their service listings, skills, and portfolio can still help you evaluate fit."}
                  </p>
                </SectionShell>

                <SectionShell eyebrow="Skills" title="Skills, categories, and operating strengths.">
                  <SkillCloud skills={allSkills} />
                </SectionShell>

                <SectionShell eyebrow="Services offered" title="Active marketplace services.">
                  {services.length ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      {services.slice(0, 6).map((service) => (
                        <ServiceCard key={service._id} service={service} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-black/54">
                      This provider has no active services yet.
                    </p>
                  )}
                </SectionShell>

                <SectionShell eyebrow="Portfolio" title="Selected proof of work.">
                  {portfolioItems.length ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      {portfolioItems.slice(0, 6).map((item) => (
                        <PortfolioCard item={item} key={item._id} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm font-medium text-black/54">
                      No public portfolio items are attached yet.
                    </p>
                  )}
                </SectionShell>

                <ReviewsPlaceholder reviews={providerReviews} stats={stats} />

                <MotionSection
                  className="rounded-[2.2rem] bg-black p-7 text-white shadow-[0_32px_90px_rgba(0,0,0,0.16)] sm:p-9"
                  initial={{ opacity: 0, y: 18 }}
                  transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true, margin: "-80px" }}
                  whileInView={{ opacity: 1, y: 0 }}
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#65A30D]">
                        Ready to talk
                      </p>
                      <h2 className="mt-3 max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.065em]">
                        Start with a scoped conversation.
                      </h2>
                      <p className="mt-4 max-w-xl text-sm font-medium leading-7 text-white/62">
                        Contact the provider, review services, and move into a project once the
                        scope is clear.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        isLoading={contactMutation.isPending}
                        loadingLabel="Opening chat..."
                        onClick={() => contactMutation.mutate()}
                      >
                        Message Provider
                      </Button>
                      <Button
                        isLoading={connectMutation.isPending}
                        loadingLabel="Sending..."
                        onClick={() => connectMutation.mutate()}
                        variant="secondary"
                      >
                        Connect
                      </Button>
                      <Button
                        isLoading={saveProviderMutation.isPending}
                        loadingLabel="Saving..."
                        onClick={() => saveProviderMutation.mutate()}
                        variant="outline"
                      >
                        {savedProviderItem ? "Remove saved" : "Save provider"}
                      </Button>
                    </div>
                  </div>
                </MotionSection>
              </main>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
