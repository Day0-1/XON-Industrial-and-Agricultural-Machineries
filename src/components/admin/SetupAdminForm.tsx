"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminInput,
  adminButtonPrimaryClass,
  adminErrorClass,
  adminLabelClass,
} from "@/components/admin/AdminFields";
import { OtpSixInput } from "@/components/admin/OtpSixInput";

export function SetupAdminForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Setup failed");

      router.push("/login?created=1");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Setup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className={adminErrorClass}>{error}</p>}

      <div>
        <label className={adminLabelClass} htmlFor="setup-username">
          Username
        </label>
        <AdminInput
          id="setup-username"
          required
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="setup-password">
          Password
        </label>
        <AdminInput
          id="setup-password"
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="setup-confirm">
          Confirm password
        </label>
        <AdminInput
          id="setup-confirm"
          required
          type="password"
          minLength={8}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <div>
        <label className={adminLabelClass}>Setup verification code</label>
        <p className="mb-3 text-xs leading-relaxed text-slate-500">
          Enter the 6-digit setup code from{" "}
          <span className="font-medium text-slate-700">ADMIN_SETUP_OTP</span> in
          your environment file.
        </p>
        <OtpSixInput value={otp} onChange={setOtp} disabled={loading} />
      </div>

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className={`w-full ${adminButtonPrimaryClass}`}
      >
        {loading ? "Creating account…" : "Create admin account"}
      </button>
    </form>
  );
}
