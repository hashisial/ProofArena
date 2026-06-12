import { useState } from "react";
import { useSubmitLead } from "../hooks/useSubmitLead.js";
import { useToast } from "../hooks/useToast.js";
import { SERVICE_CATEGORY_META } from "../utils/constants.js";
import { Button } from "./Button.jsx";

const initialForm = {
  email: "",
  message: "",
  name: "",
  service: "growth",
};

const contactFields = ["name", "email", "service", "message"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(fieldName, value) {
  const trimmedValue = value.trim();

  if (fieldName === "name" && !trimmedValue) {
    return "Name is required";
  }

  if (fieldName === "email") {
    if (!trimmedValue) {
      return "Email is required";
    }

    if (!emailPattern.test(trimmedValue)) {
      return "Enter a valid email address";
    }
  }

  if (fieldName === "service" && !trimmedValue) {
    return "Select a service";
  }

  if (fieldName === "message") {
    if (!trimmedValue) {
      return "Message is required";
    }

    if (trimmedValue.length < 10) {
      return "Message must be at least 10 characters";
    }
  }

  return "";
}

function validateForm(form) {
  const errors = {};

  contactFields.forEach((fieldName) => {
    const error = validateField(fieldName, form[fieldName] ?? "");

    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

export function ContactForm() {
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ message: "", type: "idle" });
  const [touchedFields, setTouchedFields] = useState({});
  const submitLeadMutation = useSubmitLead();
  const { showToast } = useToast();

  function updateField(event) {
    const { name, value } = event.target;
    const nextForm = {
      ...form,
      [name]: value,
    };

    setForm(nextForm);
    setErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
        [name]: "",
      };

      if (touchedFields[name]) {
        const fieldError = validateField(name, value);

        if (fieldError) {
          nextErrors[name] = fieldError;
        } else {
          delete nextErrors[name];
        }
      }

      return nextErrors;
    });
    if (status.type !== "idle") {
      setStatus({ message: "", type: "idle" });
    }
  }

  function handleFieldBlur(event) {
    const { name, value } = event.target;
    const fieldError = validateField(name, value);

    setTouchedFields((currentFields) => ({
      ...currentFields,
      [name]: true,
    }));
    setErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
      };

      if (fieldError) {
        nextErrors[name] = fieldError;
      } else {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateForm(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setTouchedFields(
        contactFields.reduce((fields, fieldName) => {
          fields[fieldName] = true;
          return fields;
        }, {}),
      );
      showToast({
        message: "Fix the highlighted fields before submitting.",
        type: "error",
      });
      setStatus({
        message: "Fix the highlighted fields before submitting.",
        type: "error",
      });
      return;
    }

    setStatus({ message: "", type: "idle" });

    try {
      const response = await submitLeadMutation.mutateAsync({
        ...form,
        service:
          SERVICE_CATEGORY_META.find((item) => item.id === form.service)?.label ??
          form.service,
      });

      setForm(initialForm);
      setErrors({});
      setTouchedFields({});
      showToast({
        message:
          response?.message ??
          "Inquiry submitted successfully. We will reply shortly.",
        type: "success",
      });
      setStatus({
        message:
          response?.message ??
          "Inquiry submitted successfully. We will reply shortly.",
        type: "success",
      });
    } catch (requestError) {
      if (Array.isArray(requestError.errors) && requestError.errors.length > 0) {
        setErrors(
          requestError.errors.reduce((nextErrors, validationError) => {
            nextErrors[validationError.field] = validationError.message;
            return nextErrors;
          }, {}),
        );
      }

      showToast({
        message: requestError.message ?? "Unable to submit your inquiry right now.",
        type: "error",
      });
      setStatus({
        message: requestError.message ?? "Unable to submit your inquiry right now.",
        type: "error",
      });
    }
  }

  const inputClass =
    "mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#3F6212]/60 focus:ring-4 focus:ring-[#3F6212]/10 disabled:cursor-not-allowed disabled:bg-black/[0.03]";
  const getErrorId = (fieldName) => `contact-${fieldName}-error`;

  return (
    <form
      className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-[0_30px_90px_rgba(17,17,17,0.1)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold text-black">
          Name
          <input
            aria-describedby={errors.name ? getErrorId("name") : undefined}
            aria-invalid={Boolean(errors.name)}
            className={inputClass}
            name="name"
            disabled={submitLeadMutation.isPending}
            onBlur={handleFieldBlur}
            onChange={updateField}
            placeholder="Your name"
            value={form.name}
          />
          {errors.name ? (
            <span
              className="mt-2 block text-xs text-[#365314]"
              id={getErrorId("name")}
            >
              {errors.name}
            </span>
          ) : null}
        </label>
        <label className="text-sm font-semibold text-black">
          Email
          <input
            aria-describedby={errors.email ? getErrorId("email") : undefined}
            aria-invalid={Boolean(errors.email)}
            className={inputClass}
            name="email"
            disabled={submitLeadMutation.isPending}
            onBlur={handleFieldBlur}
            onChange={updateField}
            placeholder="you@company.com"
            type="email"
            value={form.email}
          />
          {errors.email ? (
            <span
              className="mt-2 block text-xs text-[#365314]"
              id={getErrorId("email")}
            >
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      <label className="mt-5 block text-sm font-semibold text-black">
        Service
        <select
          aria-describedby={errors.service ? getErrorId("service") : undefined}
          aria-invalid={Boolean(errors.service)}
          className={inputClass}
          name="service"
          disabled={submitLeadMutation.isPending}
          onBlur={handleFieldBlur}
          onChange={updateField}
          value={form.service}
        >
          {SERVICE_CATEGORY_META.map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>
        {errors.service ? (
          <span
            className="mt-2 block text-xs text-[#365314]"
            id={getErrorId("service")}
          >
            {errors.service}
          </span>
        ) : null}
      </label>

      <label className="mt-5 block text-sm font-semibold text-black">
        Message
        <textarea
          aria-describedby={errors.message ? getErrorId("message") : undefined}
          aria-invalid={Boolean(errors.message)}
          className={`${inputClass} min-h-32 resize-y`}
          name="message"
          disabled={submitLeadMutation.isPending}
          onBlur={handleFieldBlur}
          onChange={updateField}
          placeholder="Tell us what you want to improve."
          value={form.message}
        />
        {errors.message ? (
          <span
            className="mt-2 block text-xs text-[#365314]"
            id={getErrorId("message")}
          >
            {errors.message}
          </span>
        ) : null}
      </label>

      {status.message ? (
        <div
          className={`mt-5 rounded-2xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-[#3F6212]/25 bg-[#3F6212] text-white"
              : "border-[#3F6212]/30 bg-[#F7FEE7] text-[#365314]"
          }`}
        >
          {status.message}
        </div>
      ) : null}

      <Button
        className="mt-6 w-full"
        disabled={submitLeadMutation.isPending}
        isLoading={submitLeadMutation.isPending}
        loadingLabel="Submitting..."
        type="submit"
      >
        Send Growth Request
      </Button>
    </form>
  );
}
