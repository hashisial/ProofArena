import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { ROUTES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import { getPasswordStrengthError, isRequired, isStrongPassword } from "../utils/index.js";

const initialForm = {
  confirmPassword: "",
  password: "",
};

function getAuthError(error, fallback) {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0]?.message ?? fallback;
  }

  return error?.message ?? fallback;
}

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isAuthenticated, isAuthChecking, resetPassword } = useAuth();

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
    setFormError("");
  }

  function validateForm() {
    const nextErrors = {};

    if (!isStrongPassword(form.password)) {
      nextErrors.password = getPasswordStrengthError(form.password);
    }

    if (!isRequired(form.confirmPassword)) {
      nextErrors.confirmPassword = "Confirm your new password.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!token || !validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      await resetPassword({
        confirmPassword: form.confirmPassword,
        password: form.password,
        token,
      });
      setForm(initialForm);
      setIsSuccess(true);
    } catch (error) {
      setFormError(getAuthError(error, "Unable to reset password. Please request a new link."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthChecking && isAuthenticated) {
    return <Navigate replace to={ROUTES.DASHBOARD} />;
  }

  if (!token) {
    return (
      <Card className="border-[#E9E2F3] shadow-[0_24px_80px_rgba(124, 58, 237, 0.12)]" padding="lg" variant="elevated">
        <CardHeader>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
            Reset link
          </p>
          <CardTitle as="h1" className="text-3xl sm:text-4xl">
            Reset token is missing or invalid.
          </CardTitle>
          <CardDescription>
            Request a new reset link to secure your ProofArena workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button as="a" className="w-full" href={ROUTES.FORGOT_PASSWORD}>
            Request a new reset link
          </Button>
          <p className="mt-6 text-sm font-semibold text-[#6F657C]">
            <Link className="text-[#5B21B6] transition hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" to={ROUTES.LOGIN}>
              Back to login
            </Link>
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#E9E2F3] shadow-[0_24px_80px_rgba(124, 58, 237, 0.12)]" padding="lg" variant="elevated">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#7C3AED]">
          Secure access
        </p>
        <CardTitle as="h1" className="text-3xl sm:text-4xl">
          Create a new password
        </CardTitle>
        <CardDescription>
          Choose a strong password to secure your ProofArena workspace.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isSuccess ? (
          <div className="grid gap-5">
            <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#F5F3FF] px-4 py-4 text-sm font-semibold leading-6 text-[#5B21B6]">
              Password reset successfully. You can now log in.
            </div>
            <Button as="a" className="w-full" href={ROUTES.LOGIN}>
              Go to login
            </Button>
          </div>
        ) : (
          <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
            <Input
              autoComplete="new-password"
              error={fieldErrors.password}
              helperText="Use at least 8 characters with uppercase, lowercase, and a number."
              id="reset-password-new"
              label="New password"
              name="password"
              onChange={updateField}
              required
              type="password"
              value={form.password}
            />

            <Input
              autoComplete="new-password"
              error={fieldErrors.confirmPassword}
              id="reset-password-confirm"
              label="Confirm new password"
              name="confirmPassword"
              onChange={updateField}
              required
              type="password"
              value={form.confirmPassword}
            />

            {formError ? (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {formError}
              </p>
            ) : null}

            <Button
              className="w-full"
              disabled={isSubmitting}
              isLoading={isSubmitting}
              loadingLabel="Resetting..."
              type="submit"
            >
              Reset password
            </Button>
          </form>
        )}

        {!isSuccess ? (
          <p className="mt-6 text-sm font-semibold text-[#6F657C]">
            <Link className="text-[#5B21B6] transition hover:text-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70" to={ROUTES.LOGIN}>
              Back to login
            </Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
