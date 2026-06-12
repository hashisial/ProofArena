import { useEffect, useState } from "react";
import { useAdminLogin } from "../hooks/useAdminLogin.js";
import { logoutUser, refreshUserSession } from "../services/api.js";
import {
  clearStoredAdminToken,
  getStoredAdminToken,
  setStoredAdminToken,
} from "../store/authSession.js";
import { Button } from "./Button.jsx";

export function AdminGate({ children }) {
  const [token, setToken] = useState(getStoredAdminToken);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const loginMutation = useAdminLogin();
  const isUnlocked = Boolean(token);

  useEffect(() => {
    let isCurrent = true;

    async function hydrateAdmin() {
      if (token) {
        return;
      }

      try {
        const response = await refreshUserSession();

        if (isCurrent && response.user?.role === "admin") {
          setStoredAdminToken(response.accessToken ?? response.token);
          setToken(response.accessToken ?? response.token);
        }
      } catch {
        // No admin refresh session is available.
      }
    }

    hydrateAdmin();

    return () => {
      isCurrent = false;
    };
  }, [token]);

  function updateField(event) {
    const { name, value } = event.target;

    setCredentials((currentCredentials) => ({
      ...currentCredentials,
      [name]: value,
    }));
    setErrorMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!credentials.email.trim() || !credentials.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const response = await loginMutation.mutateAsync(credentials);

      if (response.user?.role !== "admin") {
        setErrorMessage("Admin credentials are required for this dashboard.");
        return;
      }

      setStoredAdminToken(response.token);
      setToken(response.token);
      setCredentials({ email: "", password: "" });
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ?? error.message ?? "Unable to log in as admin.",
      );
    }
  }

  if (isUnlocked) {
    return children({
      lockAdmin: async () => {
        try {
          await logoutUser();
        } catch {
          // Local lock should still complete if the server session is gone.
        }
        clearStoredAdminToken();
        setToken("");
      },
      token,
    });
  }

  return (
    <div className="mx-auto max-w-xl rounded-[2rem] border border-[#3F6212]/18 bg-white p-6 shadow-[0_30px_100px_rgba(63, 98, 18, 0.14)] backdrop-blur-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#65A30D]">
        Protected
      </p>
      <h1 className="mt-4 text-3xl font-bold tracking-[-0.05em] text-black">
        Admin access required
      </h1>
      <p className="mt-3 text-sm leading-6 text-black/60">
        Log in with the server admin credentials. The API returns a JWT token
        for this browser session.
      </p>
      <form className="mt-6" onSubmit={handleSubmit}>
        <label className="text-sm font-semibold text-black/78">
          Email
          <input
            className="mt-2 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#65A30D]/60 focus:ring-4 focus:ring-[#3F6212]/15"
            name="email"
            onChange={updateField}
            placeholder="admin@example.com"
            type="email"
            value={credentials.email}
          />
        </label>
        <label className="mt-5 block text-sm font-semibold text-black/78">
          Password
          <span className="relative mt-2 block">
            <input
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 pr-12 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[#65A30D]/60 focus:ring-4 focus:ring-[#3F6212]/15"
              name="password"
              onChange={updateField}
              placeholder="Admin password"
              type={isPasswordVisible ? "text" : "password"}
              value={credentials.password}
            />
            <button
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-black/48 transition hover:bg-[#3F6212]/8 hover:text-[#365314]"
              onClick={() => setIsPasswordVisible((current) => !current)}
              type="button"
            >
              <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </span>
        </label>
        {errorMessage ? (
          <p className="mt-5 rounded-2xl border border-[#65A30D]/20 bg-[#3F6212]/8 px-4 py-3 text-sm text-[#365314]">
            {errorMessage}
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          <a className="premium-link text-[#365314]" href="/forgot-password?role=admin">
            Forgot password?
          </a>
          <a className="premium-link text-black/62 hover:text-black" href="/">
            Back to home
          </a>
        </div>
        <Button
          className="mt-5 w-full"
          isLoading={loginMutation.isPending}
          loadingLabel="Logging in..."
          type="submit"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
