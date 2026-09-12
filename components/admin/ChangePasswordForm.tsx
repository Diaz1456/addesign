"use client";

import { useState } from "react";
import { CheckCircle2, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setError(data.error || "Could not change your password.");
        return;
      }
      setStatus("success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 text-brand-orange" />
        <h2 className="font-bold text-slate-deep">Change Password</h2>
      </div>
      <p className="flex items-center gap-2 rounded-md bg-brand-orange/10 px-3 py-2 text-xs font-medium text-brand-orange">
        <ShieldCheck className="h-4 w-4 shrink-0" />
        Your password is stored as a bcrypt hash.
      </p>

      <div>
        <label className="label" htmlFor="current">Current password</label>
        <input
          id="current"
          type="password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="input"
          autoComplete="current-password"
        />
      </div>

      <div className="relative">
        <label className="label" htmlFor="new">New password</label>
        <input
          id="new"
          type={show ? "text" : "password"}
          required
          minLength={8}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input pr-10"
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-[38px] text-slate/40 hover:text-slate"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      <div>
        <label className="label" htmlFor="confirm">Confirm new password</label>
        <input
          id="confirm"
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="input"
          autoComplete="new-password"
        />
      </div>

      {status === "error" && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
      {status === "success" && (
        <p className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          <CheckCircle2 className="h-4 w-4" /> Password updated successfully.
        </p>
      )}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-fit">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Updating…
          </>
        ) : (
          "Update password"
        )}
      </button>
    </form>
  );
}