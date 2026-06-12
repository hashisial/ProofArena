import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button.jsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Select } from "../components/ui/Select.jsx";
import { ROUTES, USER_ROLES } from "../constants/index.js";
import { useAuth } from "../features/auth/useAuth.js";
import {
  getPasswordStrengthError,
  isRequired,
  isStrongPassword,
  isValidEmail,
  isValidUsername,
} from "../utils/index.js";

const initialForm = {
  confirmPassword: "",
  email: "",
  fullName: "",
  password: "",
  role: USER_ROLES.CLIENT,
  username: "",
};

const roleOptions = [
  {
    label: "Client - I want to launch measurable outcome challenges",
    value: USER_ROLES.CLIENT,
  },
  {
    label: "Provider - I want to prove execution and win challenges",
    value: USER_ROLES.PROVIDER,
  },
];

function getAuthError(error, fallback) {
  if (Array.isArray(error?.errors) && error.errors.length > 0) {
    return error.errors[0]?.message ?? fallback;
  }

  return error?.message ?? fallback;
}

export function Register() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authError, clearAuthError, isAuthenticated, isAuthChecking, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const redirectTo = location.state?.from?.pathname ?? ROUTES.DASHBOARD;

  const generalError = formError || authError?.message || "";

  const isSubmitDisabled = useMemo(() => {
    return (
      isAuthChecking ||
      isSubmitting ||
      !form.fullName.trim() ||
      !form.username.trim() ||
      !form.email.trim() ||
      !form.password ||
      !form.confirmPassword
    );
  }, [form, isAuthChecking, isSubmitting]);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: name === "username" ? value.trim().toLowerCase() : value,
    }));
    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
    setFormError("");
    clearAuthError();
  }

  function validateForm() {
    const nextErrors = {};
    const normalizedRole = form.role?.trim();

    if (!isRequired(form.fullName)) {
      nextErrors.fullName = "Full name is required.";
    } else if (form.fullName.trim().length < 2) {
      nextErrors.fullName = "Full name must be at least 2 characters.";
    }

    if (!isRequired(form.username)) {
      nextErrors.username = "Username is required.";
    } else if (!isValidUsername(form.username)) {
      nextErrors.username = "Username must be 3-30 letters, numbers, underscores, or hyphens.";
    }

    if (!isRequired(form.email)) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(form.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!isStrongPassword(form.password)) {
      nextErrors.password = getPasswordStrengthError(form.password);
    }

    if (!isRequired(form.confirmPassword)) {
      nextErrors.confirmPassword = "Confirm your password.";
    } else if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (![USER_ROLES.CLIENT, USER_ROLES.PROVIDER].includes(normalizedRole)) {
      nextErrors.role = "Choose client or provider.";
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError("");
    clearAuthError();

    try {
      await register({
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        password: form.password,
        role: form.role,
        username: form.username.trim().toLowerCase(),
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(getAuthError(error, "Unable to create account. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isAuthChecking && isAuthenticated) {
    return <Navigate replace to={ROUTES.DASHBOARD} />;
  }

  return (
    <Card className="border-[#E7E5E4] shadow-[0_24px_80px_rgba(63, 98, 18, 0.12)]" padding="lg" variant="elevated">
      <CardHeader>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-[#3F6212]">
          ProofArena Access
        </p>
        <CardTitle as="h1" className="text-3xl sm:text-4xl">
          Start with ProofArena
        </CardTitle>
        <CardDescription>
          Create your account to launch outcome challenges or prove execution as a provider.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="grid gap-5" noValidate onSubmit={handleSubmit}>
          <Input
            autoComplete="name"
            error={fieldErrors.fullName}
            id="register-full-name"
            label="Full name"
            name="fullName"
            onChange={updateField}
            required
            value={form.fullName}
          />

          <Input
            autoComplete="username"
            error={fieldErrors.username}
            helperText="Use letters, numbers, underscores, or hyphens."
            id="register-username"
            label="Username"
            name="username"
            onChange={updateField}
            required
            value={form.username}
          />

          <Input
            autoComplete="email"
            error={fieldErrors.email}
            id="register-email"
            label="Email"
            name="email"
            onChange={updateField}
            required
            type="email"
            value={form.email}
          />

          <Input
            autoComplete="new-password"
            error={fieldErrors.password}
            helperText="Use at least 8 characters with uppercase, lowercase, and a number."
            id="register-password"
            label="Password"
            name="password"
            onChange={updateField}
            required
            type="password"
            value={form.password}
          />

          <Input
            autoComplete="new-password"
            error={fieldErrors.confirmPassword}
            id="register-confirm-password"
            label="Confirm password"
            name="confirmPassword"
            onChange={updateField}
            required
            type="password"
            value={form.confirmPassword}
          />

          <Select
            error={fieldErrors.role}
            id="register-role"
            label="Account type"
            name="role"
            onChange={updateField}
            options={roleOptions}
            placeholder=""
            required
            value={form.role}
          />

          {generalError ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {generalError}
            </p>
          ) : null}

          <Button
            className="w-full"
            disabled={isSubmitDisabled}
            isLoading={isSubmitting}
            loadingLabel="Creating account..."
            type="submit"
          >
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-sm font-semibold text-[#57534E]">
          Already have an account?{" "}
          <Link className="text-[#365314] transition hover:text-[#3F6212] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70" to={ROUTES.LOGIN}>
            Login
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
