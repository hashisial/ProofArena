import { z } from "zod";

const mongoObjectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid profile item id");

const nullableDateSchema = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return value;
}, z.coerce.date().nullable().optional());

const optionalText = (max = 240) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const optionalUrl = z
  .string()
  .trim()
  .url()
  .max(500)
  .optional()
  .or(z.literal(""));

const optionalUrlList = z
  .array(z.string().trim().url().max(500))
  .max(5)
  .optional()
  .transform((items) =>
    Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean))),
  );

const locationSchema = z
  .object({
    city: optionalText(80),
    country: optionalText(80),
    state: optionalText(80),
    timezone: optionalText(80),
  })
  .partial()
  .optional();

const socialLinksSchema = z
  .object({
    facebook: optionalUrl,
    github: optionalUrl,
    instagram: optionalUrl,
    linkedin: optionalUrl,
    twitter: optionalUrl,
    website: optionalUrl,
  })
  .partial()
  .optional();

const privacySettingsSchema = z
  .object({
    allowDiscovery: z.boolean().optional(),
    allowProviderListing: z.boolean().optional(),
    allowSearchIndexing: z.boolean().optional(),
    showActivity: z.boolean().optional(),
    showEducation: z.boolean().optional(),
    showEmail: z.boolean().optional(),
    showExperience: z.boolean().optional(),
    showOpenTo: z.boolean().optional(),
    showPhone: z.boolean().optional(),
    showProofScore: z.boolean().optional(),
    showServices: z.boolean().optional(),
    showSocialLinks: z.boolean().optional(),
    showWebsite: z.boolean().optional(),
  })
  .strict()
  .optional();

const skillSchema = z.union([
  z.string().trim().min(1).max(50),
  z.object({
    isFeatured: z.boolean().optional(),
    name: z.string().trim().min(1).max(50),
    order: z.coerce.number().int().min(0).optional(),
  }),
]);

const experienceSkillSchema = z
  .array(z.string().trim().min(1).max(50))
  .max(20)
  .optional()
  .transform((skills) =>
    Array.from(new Set((skills ?? []).map((skill) => skill.trim()).filter(Boolean))),
  );

export const experienceSchema = z.object({
  company: optionalText(120),
  description: optionalText(1200),
  duration: optionalText(80),
  employmentType: z
    .enum([
      "full_time",
      "part_time",
      "contract",
      "freelance",
      "internship",
      "self_employed",
      "volunteer",
    ])
    .optional()
    .or(z.literal("")),
  endDate: nullableDateSchema,
  isCurrent: z.boolean().optional(),
  location: optionalText(120),
  order: z.coerce.number().int().min(0).optional(),
  skills: experienceSkillSchema,
  startDate: nullableDateSchema,
  title: z.string().trim().min(2).max(120),
})
  .strict()
  .superRefine((value, context) => {
    if (value.isCurrent) {
      return;
    }

    if (value.startDate && value.endDate && value.endDate < value.startDate) {
      context.addIssue({
        code: "custom",
        message: "End date cannot be earlier than start date",
        path: ["endDate"],
      });
    }
  });

export const educationSchema = z.object({
  degree: optionalText(140),
  description: optionalText(1200),
  duration: optionalText(80),
  endDate: nullableDateSchema,
  fieldOfStudy: optionalText(140),
  grade: optionalText(80),
  notes: optionalText(500),
  order: z.coerce.number().int().min(0).optional(),
  school: z.string().trim().min(2).max(140),
  startDate: nullableDateSchema,
})
  .strict()
  .superRefine((value, context) => {
    if (value.startDate && value.endDate && value.endDate < value.startDate) {
      context.addIssue({
        code: "custom",
        message: "End date cannot be earlier than start date",
        path: ["endDate"],
      });
    }
  });

const proofRequiredSchema = z
  .array(z.string().trim().min(1).max(80))
  .max(10)
  .optional()
  .transform((items) =>
    Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean))),
  );

export const serviceSchema = z
  .object({
    category: optionalText(80),
    currency: optionalText(10),
    deliveryType: z
      .enum(["fixed_scope", "hourly", "milestone", "consultation", "managed_outcome"])
      .optional()
      .or(z.literal("")),
    description: optionalText(800),
    isActive: z.boolean().optional(),
    order: z.coerce.number().int().min(0).optional(),
    proofRequired: proofRequiredSchema,
    startingPrice: z.coerce.number().min(0).optional(),
    title: z.string().trim().min(2).max(120),
  })
  .strict();

export const openToSchema = z
  .object({
    categories: z
      .array(z.string().trim().min(1).max(80))
      .max(10)
      .optional()
      .transform((items) =>
        Array.from(new Set((items ?? []).map((item) => item.trim()).filter(Boolean))),
      ),
    enabled: z.boolean(),
    note: optionalText(500),
    title: optionalText(120),
  })
  .strict();

export const requestVerificationSchema = z
  .object({
    requestNote: optionalText(1000),
    supportingLinks: optionalUrlList,
    verificationType: z
      .enum(["identity", "provider", "business", "proof_based"])
      .optional(),
    website: optionalUrl,
  })
  .strict();

export const reviewVerificationSchema = z
  .object({
    label: optionalText(50),
    rejectionReason: optionalText(1000),
    status: z.enum(["verified", "rejected"]),
  })
  .strict();

const providerProfileSchema = z
  .object({
    availability: z.enum(["available", "limited", "unavailable"]).optional(),
    categories: z.array(z.string().trim().min(1).max(64)).max(12).optional(),
    experienceLevel: z.enum(["entry", "intermediate", "expert"]).optional(),
    fixedStartingPrice: z.coerce.number().min(0).optional(),
    headline: optionalText(180),
    hourlyRate: z.coerce.number().min(0).optional(),
    isAvailableForChallenges: z.boolean().optional(),
    languages: z.array(z.string().trim().min(1).max(48)).max(12).optional(),
    professionalSummary: optionalText(1200),
    skills: z.array(z.string().trim().min(1).max(64)).max(30).optional(),
    title: optionalText(140),
  })
  .partial()
  .optional();

export const usernameParamSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9._-]{3,30}$/, "Invalid username"),
});

export const profileUsernameParamSchema = usernameParamSchema;

export const profileItemIdSchema = z
  .object({
    educationId: mongoObjectIdSchema.optional(),
    experienceId: mongoObjectIdSchema.optional(),
    serviceId: mongoObjectIdSchema.optional(),
  })
  .refine((value) => value.educationId || value.experienceId || value.serviceId, {
    message: "Profile item id is required",
  });

export const updateProfileSchema = z
  .object({
    availabilityStatus: z.enum(["available", "busy", "unavailable"]).optional(),
    bio: optionalText(2000),
    businessType: z
      .enum(["individual", "startup", "agency", "company", "enterprise"])
      .optional(),
    company: optionalText(120),
    companyName: optionalText(120),
    currentCompany: optionalText(120),
    currentPosition: optionalText(120),
    education: z.array(educationSchema).max(20).optional(),
    educationHeadline: optionalText(160),
    experience: z.array(experienceSchema).max(20).optional(),
    fullName: z.string().trim().min(2).max(80).optional(),
    headline: optionalText(180),
    industry: optionalText(80),
    location: locationSchema,
    openTo: openToSchema.partial().optional(),
    phone: optionalText(30),
    profileVisibility: z.enum(["public", "private", "hidden"]).optional(),
    providerProfile: providerProfileSchema,
    services: z.array(serviceSchema).max(12).optional(),
    skills: z.array(skillSchema).max(30).optional(),
    socialLinks: socialLinksSchema,
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9._-]{3,32}$/, "Use 3-32 lowercase letters, numbers, dots, underscores, or hyphens")
      .optional(),
    website: optionalUrl,
  })
  .strict();

export const updateIntroSchema = updateProfileSchema.pick({
  company: true,
  companyName: true,
  currentCompany: true,
  currentPosition: true,
  fullName: true,
  headline: true,
  industry: true,
  location: true,
  profileVisibility: true,
  username: true,
  website: true,
});

export const updatePrivacySettingsSchema = z
  .object({
    privacySettings: privacySettingsSchema,
    profileVisibility: z.enum(["public", "private", "hidden"]).optional(),
  })
  .strict();

export const updateAboutSchema = z
  .object({
    bio: z.string().trim().min(1).max(2000),
    businessType: z
      .enum(["individual", "startup", "agency", "company", "enterprise"])
      .optional(),
    socialLinks: socialLinksSchema,
  })
  .strict();

export const updateSkillsSchema = z
  .object({
    skills: z.array(skillSchema).max(30),
  })
  .strict();
