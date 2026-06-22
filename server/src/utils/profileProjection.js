function toPlainObject(profile) {
  if (!profile) {
    return {};
  }

  if (typeof profile.toObject === "function") {
    return profile.toObject({ getters: true, virtuals: false });
  }

  return { ...profile };
}

function readPath(source, path, fallback = undefined) {
  return path.split(".").reduce((value, key) => value?.[key], source) ?? fallback;
}

function normalizeString(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function normalizePublicTag(item) {
  if (typeof item === "string") {
    const name = normalizeString(item);
    return name ? { name } : null;
  }

  const name = normalizeString(item?.name);
  if (!name || item?.isPublic === false) {
    return null;
  }

  return {
    level: normalizeString(item?.level),
    name,
  };
}

function normalizePublicAsset(item) {
  const title = normalizeString(item?.title);

  if (!title || item?.isPublic !== true) {
    return null;
  }

  return {
    description: normalizeString(item?.description),
    title,
    url: normalizeString(item?.url),
  };
}

function compactArray(items, mapper) {
  return Array.isArray(items) ? items.map(mapper).filter(Boolean) : [];
}

function getPublicVerificationBadge(profile) {
  const badge = profile?.trustVerification?.verificationBadge ?? profile?.verificationBadge;
  const status = normalizeString(badge?.status ?? "none");

  if (status !== "verified") {
    return {
      label: "",
      status: "none",
      verifiedAt: null,
    };
  }

  return {
    label: normalizeString(badge?.label, "Verified"),
    status: "verified",
    verifiedAt: badge?.verifiedAt ?? null,
  };
}

function getPublicScore(score) {
  if (score?.source === "not_calculated") {
    return null;
  }

  const value = Number(score?.value);
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : null;
}

export function sanitizePrivateProfile(profile) {
  const plainProfile = toPlainObject(profile);
  delete plainProfile.__v;

  return plainProfile;
}

export function buildPublicProfileProjection(profile, { user = null } = {}) {
  const plainProfile = toPlainObject(profile);
  const privacy = plainProfile.privacySettings ?? {};
  const identity = plainProfile.identity ?? {};
  const professionalIdentity = plainProfile.professionalIdentity ?? {};
  const skillsProfile = plainProfile.skillsProfile ?? {};
  const servicesProfile = plainProfile.servicesProfile ?? {};
  const proofProfile = plainProfile.proofProfile ?? {};
  const trustVerification = plainProfile.trustVerification ?? {};
  const publishState = plainProfile.publishState ?? {};
  const fallbackLocation = plainProfile.location ?? {};

  const projection = {
    avatarUrl:
      normalizeString(identity.avatarUrl) ||
      normalizeString(user?.avatar?.url ?? user?.avatar) ||
      normalizeString(plainProfile.profilePicture),
    bio: normalizeString(professionalIdentity.bio || plainProfile.bio),
    coverUrl:
      normalizeString(identity.coverUrl) ||
      normalizeString(plainProfile.coverImage?.url ?? plainProfile.coverImage),
    displayName:
      normalizeString(identity.displayName) ||
      normalizeString(user?.fullName ?? user?.name),
    headline: normalizeString(professionalIdentity.headline || plainProfile.headline),
    id: plainProfile._id?.toString?.() ?? plainProfile.id ?? "",
    industry: normalizeString(professionalIdentity.industry || plainProfile.industry),
    niche: normalizeString(professionalIdentity.niche),
    proofScore: privacy.showProofScore === false
      ? null
      : getPublicScore(trustVerification.proofScore),
    publishedAt: publishState.publishedAt ?? null,
    targetClient: normalizeString(professionalIdentity.targetClient),
    username:
      normalizeString(identity.username) ||
      normalizeString(user?.username),
    verificationBadge: getPublicVerificationBadge(plainProfile),
  };

  if (privacy.showAvailability) {
    projection.availabilityStatus = normalizeString(
      professionalIdentity.availabilityStatus ||
        plainProfile.availabilityStatus ||
        plainProfile.businessReadiness?.availability,
    );
  }

  if (privacy.showLocation) {
    projection.location = {
      city: normalizeString(identity.location?.city || fallbackLocation.city),
      country: normalizeString(identity.location?.country || fallbackLocation.country),
      state: normalizeString(identity.location?.state || fallbackLocation.state),
      timezone: normalizeString(identity.location?.timezone || fallbackLocation.timezone),
    };
  }

  projection.skills = compactArray(
    skillsProfile.skills?.length ? skillsProfile.skills : plainProfile.skills,
    normalizePublicTag,
  );
  projection.tools = compactArray(skillsProfile.tools, normalizePublicTag);
  projection.platforms = compactArray(skillsProfile.platforms, normalizePublicTag);

  projection.services = privacy.showServices === false
    ? []
    : compactArray(
        servicesProfile.services?.length ? servicesProfile.services : plainProfile.services,
        normalizePublicAsset,
      );
  projection.portfolioItems = compactArray(proofProfile.portfolioItems, normalizePublicAsset);
  projection.caseStudies = privacy.showCaseStudies
    ? compactArray(proofProfile.caseStudies, normalizePublicAsset)
    : [];
  projection.certifications = privacy.showCertifications
    ? compactArray(proofProfile.certifications, normalizePublicAsset)
    : [];
  projection.achievements = compactArray(proofProfile.achievements, normalizePublicAsset);
  projection.publicProofHighlights = privacy.showProofHighlights
    ? compactArray(proofProfile.publicProofHighlights, normalizePublicAsset)
    : [];

  return projection;
}

export function assertNoPublicPrivateLeak(projection) {
  const forbiddenPaths = [
    "contactEmail",
    "contactPhone",
    "paymentMethods",
    "taxReadiness",
    "invoiceSettings",
    "matchingPreferences",
    "growthIntelligence",
    "systemMeta",
    "userId",
  ];

  return forbiddenPaths.every((path) => readPath(projection, path) === undefined);
}
