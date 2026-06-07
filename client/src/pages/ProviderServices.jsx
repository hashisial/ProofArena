import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../components/Button.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { LoadingState } from "../components/LoadingState.jsx";
import { SaaSLayout } from "../components/SaaSLayout.jsx";
import { StatusBanner } from "../components/StatusBanner.jsx";
import {
  createMyService,
  getMarketplaceCategories,
  getMyServices,
  uploadMyServiceImages,
} from "../services/api.js";

const MotionArticle = motion.article;
const MotionDiv = motion.div;
const draftStorageKey = "scaleops-provider-service-draft";
const maxImages = 6;
const maxMediaBytes = 6 * 1024 * 1024;

const initialForm = {
  category: "lead-generation",
  deliveryTime: "",
  description: "",
  fixedPrice: "",
  hourlyRate: "",
  images: [],
  pricingType: "fixed",
  revisions: "1",
  shortDescription: "",
  skills: "",
  subCategory: "",
  tags: "",
  title: "",
};

const steps = [
  {
    eyebrow: "Positioning",
    label: "Basics",
    title: "Define the offer",
  },
  {
    eyebrow: "Scope",
    label: "Delivery",
    title: "Shape the work",
  },
  {
    eyebrow: "Commercials",
    label: "Pricing",
    title: "Set the buying model",
  },
  {
    eyebrow: "Review",
    label: "Media",
    title: "Preview and submit",
  },
];
const stepFields = [
  ["title", "category", "subCategory", "shortDescription"],
  ["description", "skills", "tags", "deliveryTime", "revisions"],
  ["pricingType", "fixedPrice", "hourlyRate"],
  ["images"],
];

const fieldClass =
  "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black outline-none transition placeholder:text-black/30 focus:border-[#7C3AED]/55 focus:ring-4 focus:ring-[#7C3AED]/10";
const labelClass = "text-sm font-bold text-black/72";

function normalizeList(value) {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCategoryLabel(categoryId, categories = []) {
  return categories.find((category) => category.slug === categoryId)?.name ?? categoryId;
}

function getErrorMessage(error, fallback) {
  return error?.message ?? fallback;
}

function formatPrice(service) {
  const price = service.price ?? service.fixedPrice ?? service.hourlyRate ?? 0;

  if (!price || service.pricingType === "custom") {
    return "Custom";
  }

  const amount = `$${Number(price).toLocaleString()}`;
  return service.pricingType === "hourly" ? `${amount}/hr` : amount;
}

function getServiceStatus(service) {
  return service.status === "pending" ? "pending_review" : service.status ?? "draft";
}

function validateStep(form, stepIndex) {
  const errors = {};

  if (stepIndex === 0) {
    if (form.title.trim().length < 3) {
      errors.title = "Use at least 3 characters.";
    }

    if (!form.category) {
      errors.category = "Choose a category.";
    }

    if (form.subCategory.trim().length < 2) {
      errors.subCategory = "Add a focused subcategory.";
    }

    if (form.shortDescription.trim().length < 10) {
      errors.shortDescription = "Write at least 10 characters.";
    }
  }

  if (stepIndex === 1) {
    if (form.description.trim().length < 20) {
      errors.description = "Write at least 20 characters.";
    }

    if (normalizeList(form.skills).length === 0) {
      errors.skills = "Add at least one skill.";
    }

    if (normalizeList(form.tags).length === 0) {
      errors.tags = "Add at least one marketplace tag.";
    }

    if (form.deliveryTime.trim().length < 2) {
      errors.deliveryTime = "Add a delivery estimate.";
    }

    const revisions = Number.parseInt(form.revisions, 10);
    if (!Number.isInteger(revisions) || revisions < 0) {
      errors.revisions = "Revisions must be 0 or higher.";
    }
  }

  if (stepIndex === 2) {
    if (!["fixed", "hourly", "custom"].includes(form.pricingType)) {
      errors.pricingType = "Choose a pricing type.";
    }

    if (form.pricingType === "fixed" && Number(form.fixedPrice) <= 0) {
      errors.fixedPrice = "Add a fixed price greater than 0.";
    }

    if (form.pricingType === "hourly" && Number(form.hourlyRate) <= 0) {
      errors.hourlyRate = "Add an hourly rate greater than 0.";
    }
  }

  if (stepIndex === 3 && form.images.length === 0) {
    errors.images = "Upload at least one service image.";
  }

  return errors;
}

function getStepForError(errors) {
  return Math.max(
    stepFields.findIndex((fields) => fields.some((field) => errors[field])),
    0,
  );
}

function validateSubmission(form, status) {
  const requiredSteps = status === "draft" ? [0, 1, 2] : [0, 1, 2, 3];

  return requiredSteps.reduce((allErrors, stepIndex) => ({
    ...allErrors,
    ...validateStep(form, stepIndex),
  }), {});
}

function buildPayload(form, status) {
  return {
    category: form.category,
    deliveryTime: form.deliveryTime.trim(),
    description: form.description.trim(),
    fixedPrice: form.pricingType === "fixed" ? Number(form.fixedPrice) : 0,
    hourlyRate: form.pricingType === "hourly" ? Number(form.hourlyRate) : 0,
    images: form.images,
    pricingType: form.pricingType,
    revisions: Number.parseInt(form.revisions, 10) || 0,
    shortDescription: form.shortDescription.trim(),
    skills: normalizeList(form.skills),
    status,
    subCategory: form.subCategory.trim(),
    tags: normalizeList(form.tags),
    title: form.title.trim(),
  };
}

function getInitialDraftForm() {
  if (typeof window === "undefined") {
    return initialForm;
  }

  try {
    const savedDraft = JSON.parse(localStorage.getItem(draftStorageKey) ?? "null");

    if (savedDraft && typeof savedDraft === "object") {
      return {
        ...initialForm,
        ...savedDraft,
        images: Array.isArray(savedDraft.images) ? savedDraft.images.slice(0, maxImages) : [],
      };
    }
  } catch {
    localStorage.removeItem(draftStorageKey);
  }

  return initialForm;
}

function Field({ error, label, name, onChange, value, ...props }) {
  return (
    <label className={labelClass}>
      {label}
      <input
        className={`${fieldClass} ${error ? "border-[#7C3AED]/55 bg-[#F5F3FF]" : ""}`}
        name={name}
        onChange={onChange}
        value={value}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs font-bold text-[#5B21B6]">{error}</span> : null}
    </label>
  );
}

function TextArea({ error, label, name, onChange, value, ...props }) {
  return (
    <label className={labelClass}>
      {label}
      <textarea
        className={`${fieldClass} min-h-32 resize-none ${error ? "border-[#7C3AED]/55 bg-[#F5F3FF]" : ""}`}
        name={name}
        onChange={onChange}
        value={value}
        {...props}
      />
      {error ? <span className="mt-2 block text-xs font-bold text-[#5B21B6]">{error}</span> : null}
    </label>
  );
}

function StatusPill({ status }) {
  const normalizedStatus = status === "pending_review" ? "pending review" : status;
  const classes =
    status === "active"
      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700"
      : status === "rejected"
        ? "border-red-500/20 bg-red-500/10 text-red-700"
        : status === "draft"
          ? "border-black/10 bg-white text-black/58"
          : "border-[#7C3AED]/20 bg-[#7C3AED]/10 text-[#5B21B6]";

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-bold capitalize ${classes}`}>
      {normalizedStatus}
    </span>
  );
}

function ProgressRail({ currentStep, fieldErrors, onSelectStep }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {steps.map((step, index) => {
        const isActive = currentStep === index;
        const hasError = stepFields[index].some((field) => Boolean(fieldErrors[field]));

        return (
          <button
            className={`group rounded-[1.35rem] border p-4 text-left transition duration-300 ${
              isActive
                ? "border-[#7C3AED]/45 bg-[#7C3AED] text-white shadow-[0_22px_60px_rgba(124, 58, 237, 0.26)]"
                : "border-black/10 bg-white text-black hover:-translate-y-0.5 hover:border-[#7C3AED]/30 hover:shadow-[0_18px_45px_rgba(124, 58, 237, 0.12)]"
            }`}
            key={step.label}
            onClick={() => onSelectStep(index)}
            type="button"
          >
            <span className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
              isActive ? "bg-white text-[#5B21B6]" : "bg-[#F5F3FF] text-[#5B21B6]"
            }`}>
              {index + 1}
            </span>
            <span className="mt-4 block text-xs font-bold uppercase tracking-[0.18em] opacity-70">
              {step.label}
            </span>
            <span className="mt-1 block text-lg font-bold tracking-[-0.04em]">{step.title}</span>
            {hasError ? <span className="mt-2 block text-xs font-bold">Needs attention</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function PricingSelector({ errors, form, onChange }) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["fixed", "Fixed", "A clear package price"],
          ["hourly", "Hourly", "Good for flexible scopes"],
          ["custom", "Custom", "Quote after discovery"],
        ].map(([value, label, description]) => {
          const isActive = form.pricingType === value;

          return (
            <button
              className={`rounded-[1.35rem] border p-4 text-left transition duration-300 ${
                isActive
                  ? "border-[#7C3AED]/55 bg-[#7C3AED] text-white shadow-[0_22px_60px_rgba(124, 58, 237, 0.25)]"
                  : "border-black/10 bg-white text-black hover:-translate-y-0.5 hover:border-[#7C3AED]/30 hover:bg-[#7C3AED]/5"
              }`}
              key={value}
              name="pricingType"
              onClick={() => onChange({ target: { name: "pricingType", value } })}
              type="button"
            >
              <span className="text-lg font-bold tracking-[-0.04em]">{label}</span>
              <span className={`mt-2 block text-sm leading-6 ${isActive ? "text-white/78" : "text-black/52"}`}>
                {description}
              </span>
            </button>
          );
        })}
      </div>
      {errors.pricingType ? <span className="text-xs font-bold text-[#5B21B6]">{errors.pricingType}</span> : null}
      {form.pricingType === "fixed" ? (
        <Field
          error={errors.fixedPrice}
          label="Fixed package price"
          min="0"
          name="fixedPrice"
          onChange={onChange}
          placeholder="1500"
          type="number"
          value={form.fixedPrice}
        />
      ) : null}
      {form.pricingType === "hourly" ? (
        <Field
          error={errors.hourlyRate}
          label="Hourly rate"
          min="0"
          name="hourlyRate"
          onChange={onChange}
          placeholder="85"
          type="number"
          value={form.hourlyRate}
        />
      ) : null}
      {form.pricingType === "custom" ? (
        <div className="rounded-[1.35rem] border border-[#7C3AED]/16 bg-[#F5F3FF] p-5 text-sm font-semibold leading-6 text-[#5B21B6]">
          Custom pricing will show as a consultation-based offer. Buyers see the scope first, then contact you for a quote.
        </div>
      ) : null}
    </div>
  );
}

function ImageUploader({ errors, form, isUploading, onRemoveImage, onUpload }) {
  return (
    <div className="grid gap-4">
      <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border border-dashed border-[#7C3AED]/30 bg-[radial-gradient(circle_at_50%_0%,rgba(124, 58, 237, 0.12),transparent_18rem),#ffffff] p-6 text-center transition hover:-translate-y-0.5 hover:border-[#7C3AED]/55 hover:shadow-[0_22px_60px_rgba(124, 58, 237, 0.16)]">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#7C3AED] text-lg font-black text-white shadow-[0_18px_44px_rgba(124, 58, 237, 0.28)]">
          +
        </span>
        <span className="mt-4 text-lg font-bold tracking-[-0.04em] text-black">
          Upload service images
        </span>
        <span className="mt-2 max-w-sm text-sm leading-6 text-black/52">
          Add up to {maxImages} polished screenshots or visuals. JPG, PNG, WEBP, and GIF are supported.
        </span>
        <input
          accept="image/*"
          className="sr-only"
          disabled={isUploading}
          multiple
          onChange={onUpload}
          type="file"
        />
      </label>
      {errors.images ? <span className="text-xs font-bold text-[#5B21B6]">{errors.images}</span> : null}
      {isUploading ? (
        <StatusBanner>Uploading images to the media service...</StatusBanner>
      ) : null}
      {form.images.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {form.images.map((image) => (
            <div className="group relative overflow-hidden rounded-[1.25rem] border border-black/10 bg-white shadow-[0_16px_44px_rgba(124, 58, 237, 0.08)]" key={image}>
              <img alt="" className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" src={image} />
              <button
                className="absolute right-2 top-2 rounded-full bg-black px-3 py-1 text-xs font-bold text-white transition hover:bg-[#7C3AED]"
                onClick={() => onRemoveImage(image)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ServicePreview({ categories, form }) {
  const previewImage = form.images[0];
  const previewPrice =
    form.pricingType === "fixed"
      ? form.fixedPrice
      : form.pricingType === "hourly"
        ? form.hourlyRate
        : "";
  const priceLabel =
    form.pricingType === "custom" || !previewPrice
      ? "Custom"
      : form.pricingType === "hourly"
        ? `$${Number(previewPrice).toLocaleString()}/hr`
        : `$${Number(previewPrice).toLocaleString()}`;

  return (
    <aside className="xl:sticky xl:top-8">
      <div className="overflow-hidden rounded-[2rem] border border-[#7C3AED]/14 bg-white shadow-[0_28px_90px_rgba(124, 58, 237, 0.12)]">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#100719]">
          {previewImage ? (
            <img alt="" className="h-full w-full object-cover" src={previewImage} />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_22%_12%,rgba(167, 139, 250, 0.62),transparent_8rem),radial-gradient(circle_at_80%_35%,rgba(124, 58, 237, 0.46),transparent_10rem),linear-gradient(135deg,#07030D,#1b0c2c_58%,#7C3AED)]" />
          )}
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-black/56 px-4 py-3 text-white backdrop-blur-xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em]">
              {getCategoryLabel(form.category, categories)}
            </span>
            <span className="text-sm font-black">{priceLabel}</span>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED]">
            Marketplace preview
          </p>
          <h3 className="mt-3 text-3xl font-bold leading-[0.98] tracking-[-0.06em] text-black">
            {form.title || "Your premium service title"}
          </h3>
          <p className="mt-4 text-sm leading-6 text-black/58">
            {form.shortDescription || "A concise promise that tells buyers exactly what result this service creates."}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {normalizeList(form.skills || form.tags)
              .slice(0, 5)
              .map((skill) => (
                <span className="rounded-full border border-[#7C3AED]/18 bg-[#F5F3FF] px-3 py-1 text-xs font-bold text-[#5B21B6]" key={skill}>
                  {skill}
                </span>
              ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/38">Delivery</p>
              <p className="mt-1 text-sm font-black text-black">{form.deliveryTime || "Scoped"}</p>
            </div>
            <div className="rounded-2xl border border-black/10 bg-white px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/38">Revisions</p>
              <p className="mt-1 text-sm font-black text-black">{form.revisions || "0"}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

function ExistingServiceCard({ categories, service }) {
  const status = getServiceStatus(service);

  return (
    <MotionArticle
      className="overflow-hidden rounded-[1.7rem] border border-[#7C3AED]/14 bg-white shadow-[0_22px_70px_rgba(124, 58, 237, 0.08)]"
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35 }}
      viewport={{ once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="grid gap-4 p-5 md:grid-cols-[160px_minmax(0,1fr)_auto] md:items-center">
        <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-[#13091f]">
          {service.coverImage || service.images?.[0] ? (
            <img alt="" className="h-full w-full object-cover" src={service.coverImage || service.images?.[0]} />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_25%_20%,rgba(167, 139, 250, 0.55),transparent_8rem),linear-gradient(135deg,#07030D,#7C3AED)]" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={status} />
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-bold text-black/50">
              {getCategoryLabel(service.category, categories)}
            </span>
          </div>
          <h3 className="mt-3 text-2xl font-bold tracking-[-0.05em] text-black">{service.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/58">
            {service.shortDescription || service.description}
          </p>
        </div>
        <div className="grid gap-2 text-left md:text-right">
          <p className="text-xl font-bold text-black">{formatPrice(service)}</p>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-black/42">
            {service.deliveryTime || "Scoped"}
          </p>
          {status === "active" ? (
            <Button as="a" className="min-h-10 px-4 py-2" href={`/marketplace/service/${service.slug || service._id}`}>
              View Live
            </Button>
          ) : null}
        </div>
      </div>
    </MotionArticle>
  );
}

export function ProviderServices() {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(getInitialDraftForm);
  const [notice, setNotice] = useState(null);
  const [step, setStep] = useState(0);
  const queryClient = useQueryClient();
  const { data: services = [], error, isError, isLoading } = useQuery({
    queryFn: getMyServices,
    queryKey: ["account", "services"],
    staleTime: 20_000,
  });
  const { data: categories = [] } = useQuery({
    queryFn: getMarketplaceCategories,
    queryKey: ["marketplace", "categories"],
    staleTime: 120_000,
  });
  const uploadMutation = useMutation({
    mutationFn: uploadMyServiceImages,
    onError: (uploadError) => {
      setNotice({
        text: getErrorMessage(uploadError, "Unable to upload images."),
        tone: "error",
      });
    },
    onSuccess: (uploads) => {
      const uploadedUrls = (uploads.items ?? [])
        .map((item) => item.url)
        .filter(Boolean);

      if (uploadedUrls.length === 0) {
        setNotice({ text: "No image URLs were returned from the server.", tone: "error" });
        return;
      }

      setForm((current) => ({
        ...current,
        images: Array.from(new Set([...current.images, ...uploadedUrls])).slice(0, maxImages),
      }));
      setErrors((current) => ({ ...current, images: "" }));
      setNotice({
        text: `${uploadedUrls.length} service image${uploadedUrls.length === 1 ? "" : "s"} uploaded.`,
        tone: "success",
      });
    },
  });
  const createMutation = useMutation({
    mutationFn: createMyService,
    onError: (mutationError) => {
      setNotice({
        text: getErrorMessage(mutationError, "Unable to create service."),
        tone: "error",
      });
    },
    onSuccess: (_service, variables) => {
      setForm(initialForm);
      setErrors({});
      setStep(0);
      localStorage.removeItem(draftStorageKey);
      setNotice({
        text:
          variables.status === "draft"
            ? "Service draft saved to your account."
            : "Service submitted for review. Admin moderation can approve it for marketplace discovery.",
        tone: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["account", "services"] });
      queryClient.invalidateQueries({ queryKey: ["marketplace", "services"] });
    },
  });
  const stats = useMemo(
    () => ({
      active: services.filter((service) => getServiceStatus(service) === "active").length,
      pending: services.filter((service) => getServiceStatus(service) === "pending_review").length,
      total: services.length,
    }),
    [services],
  );
  const activeStepErrors = validateStep(form, step);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(draftStorageKey, JSON.stringify(form));
  }, [form]);

  function updateForm(event) {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setNotice(null);
  }

  function selectStep(nextStep) {
    if (nextStep <= step) {
      setStep(nextStep);
      return;
    }

    const currentErrors = validateStep(form, step);

    if (Object.keys(currentErrors).length > 0) {
      setErrors((current) => ({ ...current, ...currentErrors }));
      setNotice({ text: "Fix the highlighted fields before moving forward.", tone: "error" });
      return;
    }

    setStep(nextStep);
  }

  function goNext() {
    const currentErrors = validateStep(form, step);

    if (Object.keys(currentErrors).length > 0) {
      setErrors((current) => ({ ...current, ...currentErrors }));
      setNotice({ text: "Fix the highlighted fields before moving forward.", tone: "error" });
      return;
    }

    setErrors({});
    setNotice(null);
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0));
    setNotice(null);
  }

  function handleImageUpload(event) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (files.length === 0) {
      return;
    }

    const availableSlots = maxImages - form.images.length;

    if (availableSlots <= 0) {
      setNotice({ text: `You can upload up to ${maxImages} service images.`, tone: "error" });
      return;
    }

    const selectedFiles = files.slice(0, availableSlots);
    const invalidFile = selectedFiles.find((file) => !file.type.startsWith("image/") || file.size > maxMediaBytes);

    if (invalidFile) {
      setNotice({
        text: "Use JPG, PNG, WEBP, or GIF images smaller than 6MB.",
        tone: "error",
      });
      return;
    }

    uploadMutation.mutate(selectedFiles);
  }

  function removeImage(image) {
    setForm((current) => ({
      ...current,
      images: current.images.filter((item) => item !== image),
    }));
  }

  function submitService(status) {
    const allErrors = validateSubmission(form, status);

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      setStep(getStepForError(allErrors));
      setNotice({ text: "Complete the required fields before submitting.", tone: "error" });
      return;
    }

    createMutation.mutate(buildPayload(form, status));
  }

  function saveLocalDraft() {
    localStorage.setItem(draftStorageKey, JSON.stringify(form));
    setNotice({ text: "Draft saved locally in this browser.", tone: "success" });
  }

  function renderStep() {
    if (step === 0) {
      return (
        <div className="grid gap-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              error={errors.title}
              label="Service title"
              name="title"
              onChange={updateForm}
              placeholder="High-converting SaaS onboarding system"
              value={form.title}
            />
            <label className={labelClass}>
              Category
              <select
                className={`${fieldClass} ${errors.category ? "border-[#7C3AED]/55 bg-[#F5F3FF]" : ""}`}
                name="category"
                onChange={updateForm}
                value={form.category}
              >
                {categories.some((category) => category.slug === form.category) ? null : (
                  <option value={form.category}>{getCategoryLabel(form.category, categories)}</option>
                )}
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.category ? <span className="mt-2 block text-xs font-bold text-[#5B21B6]">{errors.category}</span> : null}
            </label>
          </div>
          <Field
            error={errors.subCategory}
            label="Subcategory"
            name="subCategory"
            onChange={updateForm}
            placeholder="Conversion strategy, CRM setup, Web3 support"
            value={form.subCategory}
          />
          <TextArea
            error={errors.shortDescription}
            label="Short description"
            maxLength="280"
            name="shortDescription"
            onChange={updateForm}
            placeholder="Summarize the outcome buyers get in one sharp paragraph."
            value={form.shortDescription}
          />
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="grid gap-5">
          <TextArea
            error={errors.description}
            label="Full description"
            name="description"
            onChange={updateForm}
            placeholder="Explain the problem, the process, what is included, and what the buyer can expect."
            value={form.description}
          />
          <div className="grid gap-5 lg:grid-cols-2">
            <TextArea
              error={errors.skills}
              label="Skills, comma or line separated"
              name="skills"
              onChange={updateForm}
              placeholder={"React\nAutomation\nCRM"}
              value={form.skills}
            />
            <TextArea
              error={errors.tags}
              label="Tags, comma or line separated"
              name="tags"
              onChange={updateForm}
              placeholder={"SaaS\nLead generation\nConversion"}
              value={form.tags}
            />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <Field
              error={errors.deliveryTime}
              label="Delivery time"
              name="deliveryTime"
              onChange={updateForm}
              placeholder="7-10 business days"
              value={form.deliveryTime}
            />
            <Field
              error={errors.revisions}
              label="Revisions"
              min="0"
              name="revisions"
              onChange={updateForm}
              type="number"
              value={form.revisions}
            />
          </div>
        </div>
      );
    }

    if (step === 2) {
      return <PricingSelector errors={errors} form={form} onChange={updateForm} />;
    }

    return (
      <ImageUploader
        errors={errors}
        form={form}
        isUploading={uploadMutation.isPending}
        onRemoveImage={removeImage}
        onUpload={handleImageUpload}
      />
    );
  }

  return (
    <SaaSLayout eyebrow="Provider marketplace" title="Service listings">
      <div className="grid gap-7">
        <section className="overflow-hidden rounded-[2rem] border border-[#7C3AED]/16 bg-[radial-gradient(circle_at_90%_10%,rgba(124, 58, 237, 0.16),transparent_30%),#ffffff] p-6 shadow-[0_28px_90px_rgba(124, 58, 237, 0.1)] md:p-8">
          <div className="grid gap-8 xl:grid-cols-[1fr_420px]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#7C3AED]">
                Provider offer builder
              </p>
              <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[0.98] tracking-[-0.07em] text-black md:text-6xl">
                Package your expertise into a marketplace-ready service.
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-black/58">
                Build a clear offer, upload polished visuals, preview the listing, and submit it for admin review before it appears in marketplace discovery.
              </p>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-[0_20px_65px_rgba(124, 58, 237, 0.08)]">
              {[
                ["Total listings", stats.total],
                ["Pending review", stats.pending],
                ["Live marketplace", stats.active],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between rounded-2xl bg-[#F8F4FF] px-4 py-3" key={label}>
                  <span className="text-sm font-semibold text-black/56">{label}</span>
                  <strong className="text-xl text-black">{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        {notice ? <StatusBanner tone={notice.tone}>{notice.text}</StatusBanner> : null}

        <section className="rounded-[2rem] border border-[#7C3AED]/12 bg-white p-4 shadow-[0_26px_80px_rgba(124, 58, 237, 0.08)] sm:p-5 lg:p-6">
          <ProgressRail
            currentStep={step}
            fieldErrors={errors}
            onSelectStep={selectStep}
          />
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
          <section className="rounded-[2rem] border border-[#7C3AED]/14 bg-white p-5 shadow-[0_26px_80px_rgba(124, 58, 237, 0.08)] sm:p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#7C3AED]">
                  {steps[step].eyebrow}
                </p>
                <h2 className="mt-2 text-3xl font-bold leading-none tracking-[-0.06em] text-black md:text-4xl">
                  {steps[step].title}
                </h2>
              </div>
              <span className="rounded-full border border-[#7C3AED]/18 bg-[#F5F3FF] px-4 py-2 text-xs font-bold text-[#5B21B6]">
                Step {step + 1} of {steps.length}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <MotionDiv
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
                exit={{ opacity: 0, y: -10 }}
                initial={{ opacity: 0, y: 12 }}
                key={step}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {renderStep()}
              </MotionDiv>
            </AnimatePresence>

            <div className="mt-8 flex flex-col gap-3 border-t border-black/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <Button disabled={step === 0} onClick={goBack} type="button" variant="secondary">
                  Back
                </Button>
                {step < steps.length - 1 ? (
                  <Button onClick={goNext} type="button">
                    Continue
                  </Button>
                ) : (
                  <Button
                    disabled={uploadMutation.isPending}
                    isLoading={createMutation.isPending}
                    loadingLabel="Submitting..."
                    onClick={() => submitService("pending_review")}
                    type="button"
                  >
                    Submit for Review
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button onClick={saveLocalDraft} type="button" variant="outline">
                  Save Local Draft
                </Button>
                {step === steps.length - 1 ? (
                  <Button
                    disabled={uploadMutation.isPending}
                    isLoading={createMutation.isPending}
                    loadingLabel="Saving..."
                    onClick={() => submitService("draft")}
                    type="button"
                    variant="secondary"
                  >
                    Save Account Draft
                  </Button>
                ) : null}
              </div>
            </div>

            {Object.keys(activeStepErrors).length > 0 ? (
              <p className="mt-4 text-xs font-bold text-black/42">
                Draft autosaves locally. Required fields are checked before continuing.
              </p>
            ) : null}
          </section>

          <ServicePreview categories={categories} form={form} />
        </div>

        <section className="grid gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED]">Your catalog</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.055em] text-black">Current listings</h2>
          </div>
          {isError ? <StatusBanner tone="error">{error?.message ?? "Unable to load listings."}</StatusBanner> : null}
          {isLoading ? <LoadingState columns={4} /> : null}
          {!isLoading && services.length === 0 ? (
            <EmptyState description="Create your first listing to appear in the marketplace after review." title="No provider services yet" />
          ) : null}
          <div className="grid gap-4">
            {services.map((service) => (
              <ExistingServiceCard categories={categories} key={service._id} service={service} />
            ))}
          </div>
        </section>
      </div>
    </SaaSLayout>
  );
}
