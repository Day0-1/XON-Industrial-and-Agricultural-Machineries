"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Mail } from "lucide-react";
import {
  AdminInput,
  adminButtonPrimaryClass,
  adminButtonSecondaryClass,
  adminErrorClass,
  adminLabelClass,
} from "@/components/admin/AdminFields";
import { OtpSixInput } from "@/components/admin/OtpSixInput";

function safeRedirectPath(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

type Step = "credentials" | "otp";

function StepIndicator({ step }: { step: Step }) {
  const steps = [
    { id: "credentials" as const, label: "Account" },
    { id: "otp" as const, label: "Verify" },
  ];

  return (
    <div className="mb-6 flex gap-2">
      {steps.map((item, index) => {
        const active = step === item.id;
        const done = step === "otp" && item.id === "credentials";
        return (
          <div key={item.id} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                active
                  ? "bg-slate-900 text-white"
                  : done
                    ? "bg-slate-200 text-slate-600"
                    : "bg-slate-100 text-slate-400"
              }`}
            >
              {index + 1}
            </span>
            <span
              className={`text-xs font-semibold uppercase tracking-wide ${
                active ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {item.label}
            </span>
            {index < steps.length - 1 && (
              <span className="ml-auto hidden h-px flex-1 bg-slate-200 sm:block" aria-hidden />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send code");

      setChallengeId(data.challengeId);
      setOtp("");
      setOtpSent(true);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send code");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, challengeId, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");

      const from = safeRedirectPath(searchParams.get("from"));
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setStep("credentials");
    setOtp("");
    setError("");
    setOtpSent(false);
  }

  if (step === "otp") {
    return (
      <form onSubmit={verifyOtp} className="space-y-5">
        <StepIndicator step="otp" />

        {error && <p className={adminErrorClass}>{error}</p>}

        <div className="flex items-start gap-3 border-b border-slate-100 pb-5">
          <Mail className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <div>
            <p className="text-sm font-medium text-slate-900">Check your email</p>
            <p className="mt-1 text-sm text-slate-600">
              {otpSent
                ? "We sent a 6-digit code to the admin inbox. It expires in 10 minutes."
                : "Enter the 6-digit verification code."}
            </p>
          </div>
        </div>

        <OtpSixInput value={otp} onChange={setOtp} disabled={loading} />

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className={`w-full ${adminButtonPrimaryClass}`}
        >
          {loading ? "Verifying…" : "Complete sign in"}
        </button>

        <button
          type="button"
          onClick={goBack}
          disabled={loading}
          className={`inline-flex w-full items-center justify-center gap-2 ${adminButtonSecondaryClass}`}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to username & password
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={requestOtp} className="space-y-5">
      <StepIndicator step="credentials" />

      {error && <p className={adminErrorClass}>{error}</p>}

      <div>
        <label className={adminLabelClass} htmlFor="admin-username">
          Username
        </label>
        <AdminInput
          id="admin-username"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="admin-password">
          Password
        </label>
        <AdminInput
          id="admin-password"
          required
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !username || !password}
        className={`w-full ${adminButtonPrimaryClass}`}
      >
        {loading ? "Sending code…" : "Continue"}
      </button>

      <p className="text-center text-xs text-slate-500">
        A one-time code is emailed to the admin inbox.
      </p>
    </form>
  );
}
