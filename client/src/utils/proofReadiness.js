import { ROUTES } from "../constants/index.js";

function hasText(value, minimumLength = 1) {
  return String(value ?? "").trim().length >= minimumLength;
}

function itemName(value) {
  if (typeof value === "string") return value.trim();
  return String(value?.name ?? value?.label ?? value?.title ?? "").trim();
}

function unique(values = []) {
  return Array.from(new Set(values.map(itemName).filter(Boolean)));
}

function countAssetTerms(assets = [], selector) {
  const counts = new Map();

  assets.forEach((asset) => {
    unique(selector(asset)).forEach((value) => {
      const key = value.toLowerCase();
      counts.set(key, {
        count: Number(counts.get(key)?.count ?? 0) + 1,
        label: counts.get(key)?.label ?? value,
      });
    });
  });

  return Array.from(counts.values()).sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

function assetSourceComplete(asset = {}) {
  if (asset.sourceType === "link") return hasText(asset.link?.url);
  if (asset.sourceType === "text") return hasText(asset.textProof?.content);
  if (asset.sourceType === "file") return hasText(asset.file?.url || asset.file?.filename);
  return false;
}

function assetTerms(asset = {}) {
  return unique([
    asset.category,
    ...(asset.relatedSkills ?? []),
    ...(asset.relatedTools ?? []),
    ...(asset.tags ?? []),
  ]);
}

function contextTerms(context = {}) {
  return unique([
    context.category,
    context.challenge?.category,
    ...(context.skills ?? []),
    ...(context.tools ?? []),
    ...(context.tags ?? []),
  ]);
}

function matchingTerms(asset, context) {
  const assetValues = new Set(assetTerms(asset).map((value) => value.toLowerCase()));
  return contextTerms(context).filter((value) => assetValues.has(value.toLowerCase()));
}

function proofReadinessLabel(score) {
  if (score >= 90) return "Client-ready proof system";
  if (score >= 70) return "Strong proof setup";
  if (score >= 40) return "Proof setup in progress";
  return "Weak proof setup";
}

export function getProofAssetUsage(asset = {}) {
  const counts = {
    challenges: Number(asset.linkedContextCounts?.challenges ?? asset.linkedContexts?.challengeIds?.length ?? 0),
    executionPlans: Number(asset.linkedContextCounts?.executionPlans ?? asset.linkedContexts?.executionPlanIds?.length ?? 0),
    outcomeOffers: Number(asset.linkedContextCounts?.outcomeOffers ?? asset.linkedContexts?.outcomeOfferIds?.length ?? 0),
  };

  return {
    ...counts,
    total: Number(asset.linkedContextCounts?.total ?? counts.challenges + counts.executionPlans + counts.outcomeOffers),
  };
}

export function getProofAssetQuality(asset = {}) {
  const checks = [
    {
      complete: hasText(asset.title, 8),
      description: "Use a specific title that explains what the evidence proves.",
      key: "title",
      label: "Clear title",
    },
    {
      complete: hasText(asset.description, 40),
      description: "Explain the result, your role, and what a client should notice.",
      key: "description",
      label: "Useful description",
    },
    {
      complete: assetSourceComplete(asset),
      description: "Add a working link, text record, or uploaded file.",
      key: "source",
      label: "Reviewable source",
    },
    {
      complete: hasText(asset.category),
      description: "Choose the outcome category this evidence supports.",
      key: "category",
      label: "Category added",
    },
    {
      complete: unique([...(asset.relatedSkills ?? []), ...(asset.relatedTools ?? []), ...(asset.tags ?? [])]).length > 0,
      description: "Add skills, tools, or tags so this asset can be matched to work.",
      key: "context",
      label: "Skills, tools, or tags added",
    },
    {
      complete: ["public", "unlisted"].includes(asset.visibility),
      description: "Use public or unlisted visibility only when this evidence is safe to share.",
      key: "visibility",
      label: "Shareable visibility",
    },
    {
      complete: getProofAssetUsage(asset).total > 0,
      description: "Attach this evidence to a relevant outcome offer or execution plan.",
      key: "usage",
      label: "Used in provider workflow",
    },
  ];
  const completedItems = checks.filter((item) => item.complete);
  const missingItems = checks.filter((item) => !item.complete);

  return {
    checks,
    completedItems,
    missingItems,
    score: Math.round((completedItems.length / checks.length) * 100),
    verification: {
      complete: asset.verificationStatus === "verified",
      label: asset.verificationStatus === "verified" ? "Verified evidence" : "Verification not available yet",
    },
  };
}

export function getProofUsageSummary(assets = []) {
  const safeAssets = Array.isArray(assets) ? assets : [];
  const attachedToOffers = safeAssets.filter((asset) => getProofAssetUsage(asset).outcomeOffers > 0).length;
  const attachedToPlans = safeAssets.filter((asset) => getProofAssetUsage(asset).executionPlans > 0).length;

  return {
    attached: safeAssets.filter((asset) => getProofAssetUsage(asset).total > 0).length,
    attachedToOffers,
    attachedToPlans,
    private: safeAssets.filter((asset) => asset.visibility === "private").length,
    public: safeAssets.filter((asset) => asset.visibility === "public").length,
    shareable: safeAssets.filter((asset) => ["public", "unlisted"].includes(asset.visibility)).length,
    total: safeAssets.length,
    unlisted: safeAssets.filter((asset) => asset.visibility === "unlisted").length,
    unused: safeAssets.filter((asset) => getProofAssetUsage(asset).total === 0).length,
    verified: safeAssets.filter((asset) => asset.verificationStatus === "verified").length,
  };
}

export function getProofCoverage({ assets = [], offers = [], plans = [], profileData = {} } = {}) {
  const profile = profileData?.profile ?? {};
  const providerProfile = profileData?.providerProfile ?? {};
  const assetCategories = unique(assets.map((asset) => asset.category));
  const assetSkills = unique(assets.flatMap((asset) => asset.relatedSkills ?? []));
  const assetTools = unique(assets.flatMap((asset) => asset.relatedTools ?? []));
  const priorityCategories = unique([
    ...(providerProfile.categories ?? []),
    ...(profile.openTo?.categories ?? []),
    ...offers.map((offer) => offer.category),
    ...plans.map((plan) => plan.challenge?.category ?? plan.category),
  ]);
  const prioritySkills = unique([
    ...(profile.skills ?? []),
    ...(providerProfile.skills ?? []),
    ...offers.flatMap((offer) => offer.skills ?? []),
    ...plans.flatMap((plan) => plan.skills ?? []),
  ]);
  const priorityTools = unique([
    ...(providerProfile.tools ?? []),
    ...offers.flatMap((offer) => offer.tools ?? []),
    ...plans.flatMap((plan) => plan.tools ?? []),
  ]);
  const missingFrom = (priority, covered) => {
    const coveredSet = new Set(covered.map((value) => value.toLowerCase()));
    return priority.filter((value) => !coveredSet.has(value.toLowerCase()));
  };

  return {
    categories: assetCategories,
    categoryCounts: countAssetTerms(assets, (asset) => [asset.category]),
    priorityCategories,
    prioritySkills,
    priorityTools,
    skills: assetSkills,
    skillCounts: countAssetTerms(assets, (asset) => asset.relatedSkills ?? []),
    tools: assetTools,
    toolCounts: countAssetTerms(assets, (asset) => asset.relatedTools ?? []),
    uncoveredCategories: missingFrom(priorityCategories, assetCategories),
    uncoveredSkills: missingFrom(prioritySkills, assetSkills),
    uncoveredTools: missingFrom(priorityTools, assetTools),
  };
}

export function getProofUsageSuggestions({ assets = [], offers = [], plans = [] } = {}) {
  const contexts = [
    ...offers.map((offer) => ({
      ...offer,
      contextType: "outcome offer",
      route: offer.id || offer._id ? ROUTES.EDIT_OUTCOME_OFFER(offer.id ?? offer._id) : ROUTES.MY_OUTCOME_OFFERS,
    })),
    ...plans.map((plan) => ({
      ...plan,
      contextType: "execution plan",
      route: plan.id || plan._id ? ROUTES.EXECUTION_PLAN_DETAIL(plan.id ?? plan._id) : ROUTES.MY_EXECUTION_PLANS,
    })),
  ];

  return assets
    .flatMap((asset) => contexts.map((context) => {
      const matches = matchingTerms(asset, context);
      if (matches.length === 0) return null;

      return {
        assetId: asset.id ?? asset._id,
        assetTitle: asset.title || "Proof asset",
        contextTitle: context.title || context.challenge?.title || "Provider workflow",
        contextType: context.contextType,
        matches,
        route: context.route,
      };
    }))
    .filter(Boolean)
    .slice(0, 8);
}

export function calculateProofReadiness({ assets = [], offers = [], plans = [], profileData = {} } = {}) {
  const safeAssets = Array.isArray(assets) ? assets : [];
  const usage = getProofUsageSummary(safeAssets);
  const coverage = getProofCoverage({ assets: safeAssets, offers, plans, profileData });
  const hasCompleteAsset = safeAssets.some((asset) => hasText(asset.title, 8) && hasText(asset.description, 40));
  const hasContext = safeAssets.some(
    (asset) => unique([...(asset.relatedSkills ?? []), ...(asset.relatedTools ?? []), ...(asset.tags ?? [])]).length > 0,
  );
  const coverageCount = unique([...coverage.categories, ...coverage.skills]).length;
  const verified = usage.verified > 0;
  const checks = [
    {
      complete: safeAssets.length >= 1,
      description: "Add one clear, reviewable proof asset.",
      key: "firstAsset",
      label: "Add your first proof asset",
      points: 20,
      route: `${ROUTES.PROOF_VAULT}?new=1`,
    },
    {
      complete: safeAssets.length >= 3,
      description: "Build a small evidence set so clients can verify more than one claim.",
      key: "threeAssets",
      label: "Build a three-asset proof set",
      points: 10,
      route: `${ROUTES.PROOF_VAULT}?new=1`,
    },
    {
      complete: usage.shareable >= 1,
      description: "Make one safe asset public or unlisted for client review.",
      key: "shareable",
      label: "Prepare one shareable asset",
      points: 10,
      route: ROUTES.PROOF_VAULT,
    },
    {
      complete: coverageCount >= 2,
      description: "Cover at least two categories or skills relevant to your work.",
      key: "coverage",
      label: "Expand proof coverage",
      points: 15,
      route: `${ROUTES.PROOF_VAULT}?tab=coverage`,
    },
    {
      complete: usage.attachedToOffers > 0 || usage.attachedToPlans > 0,
      description: "Connect evidence to an outcome offer or execution plan.",
      key: "attached",
      label: "Use proof in an offer or plan",
      points: 15,
      route: `${ROUTES.PROOF_VAULT}?tab=readiness`,
    },
    {
      complete: usage.attachedToOffers > 0,
      description: "Connect evidence to a relevant outcome offer so clients can review the claim behind it.",
      foundation: true,
      key: "attachedOffer",
      label: "Attach proof to an outcome offer",
      points: 0,
      route: `${ROUTES.PROOF_VAULT}?tab=readiness`,
    },
    {
      complete: usage.attachedToPlans > 0,
      description: "Use relevant evidence in an execution plan to support your proposed approach.",
      foundation: true,
      key: "attachedPlan",
      label: "Attach proof to an execution plan",
      points: 0,
      route: `${ROUTES.PROOF_VAULT}?tab=readiness`,
    },
    {
      complete: hasCompleteAsset,
      description: "Give at least one asset a clear title and useful description.",
      key: "description",
      label: "Complete proof descriptions",
      points: 10,
      route: ROUTES.PROOF_VAULT,
    },
    {
      complete: hasContext,
      description: "Add skills, tools, or tags to improve matching and reuse.",
      key: "metadata",
      label: "Add proof context",
      points: 10,
      route: ROUTES.PROOF_VAULT,
    },
    {
      complete: verified,
      description: "Verified evidence can add the final trust signal when verification becomes available.",
      foundation: !verified,
      key: "verified",
      label: verified ? "Include verified evidence" : "Verification foundation",
      points: 20,
      route: ROUTES.PROOF_VAULT,
    },
  ];
  const completedItems = checks.filter((item) => item.complete);
  const missingItems = checks.filter((item) => !item.complete);
  const earnedPoints = completedItems.reduce((total, item) => total + item.points, 0) + (!verified && safeAssets.length > 0 ? 10 : 0);
  const score = Math.min(100, Math.round((earnedPoints / 110) * 100));
  const suggestedActions = missingItems
    .filter((item) => item.key !== "attached" && (item.key !== "verified" || safeAssets.length > 0))
    .map((item, index) => ({
      ctaLabel: item.key === "firstAsset" || item.key === "threeAssets" ? "Add Proof Asset" : "Improve Proof Vault",
      description: item.description,
      key: item.key,
      priority: index === 0 ? "High" : "Medium",
      route: item.route,
      title: item.label,
    }));

  if (coverage.uncoveredSkills.length > 0) {
    suggestedActions.push({
      ctaLabel: "Review Coverage",
      description: `Add evidence for ${coverage.uncoveredSkills.slice(0, 2).join(" or ")}.`,
      key: "uncoveredSkills",
      priority: "Medium",
      route: `${ROUTES.PROOF_VAULT}?tab=coverage`,
      title: "Cover a priority skill",
    });
  }

  return {
    completedItems,
    coverage,
    label: proofReadinessLabel(score),
    missingItems,
    score,
    suggestedActions,
    usage,
    usageSuggestions: getProofUsageSuggestions({ assets: safeAssets, offers, plans }),
    verificationNote: verified
      ? "Verified evidence is included in this readiness score."
      : "Verification is not yet an active provider workflow, so the score receives partial foundation credit.",
  };
}
