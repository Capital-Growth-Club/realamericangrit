"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

const hFont = "font-[family-name:var(--font-bebas)]";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; email: string; locationId: number; userId: number }
  | { kind: "error"; message: string };

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  company: "",
};

export default function TrialOffer() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const update = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/create-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data?.error ?? "Something went wrong.",
        });
        return;
      }
      setStatus({
        kind: "success",
        email: data.email,
        locationId: data.locationId,
        userId: data.userId,
      });
    } catch {
      setStatus({
        kind: "error",
        message: "Network error. Try again.",
      });
    }
  }

  function reset() {
    setForm(EMPTY);
    setStatus({ kind: "idle" });
  }

  const submitting = status.kind === "submitting";

  return (
    <div className="relative min-h-[100dvh] bg-[#0B2341] text-white flex flex-col">
      {/* Top tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>

      <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://assets.cdn.filesafe.space/U33crx49dqSM4lE4OIY2/media/69f26d78fab44d4020b95238.png"
              alt="Real American Grit University"
              className="h-10 w-auto mx-auto mb-5"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#BF0A30]/15 border border-[#BF0A30]/30 mb-4">
              <ShieldAlert className="w-3.5 h-3.5 text-[#BF0A30]" aria-hidden="true" />
              <p className={`text-xs font-bold tracking-[0.2em] text-[#BF0A30] ${hFont}`}>
                INTERNAL USE ONLY
              </p>
            </div>
            <h1
              className={`text-4xl sm:text-5xl font-black tracking-[0.05em] leading-[0.95] mb-3 ${hFont}`}
            >
              Trial Setup
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              Provision a Standard-tier trial account on Lightspeed VT.
              Manually delete the LSVT location when the trial ends.
            </p>
          </div>

          {/* Success state */}
          {status.kind === "success" && (
            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7">
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle2 className="shrink-0 w-6 h-6 text-emerald-400 mt-0.5" aria-hidden="true" />
                <div>
                  <p className={`text-2xl font-black tracking-[0.05em] mb-1 ${hFont}`}>
                    Trial Activated
                  </p>
                  <p className="text-sm text-gray-400 break-all">
                    {status.email}
                  </p>
                </div>
              </div>
              <dl className="space-y-2 text-sm mb-6 pl-9">
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">LSVT Location</dt>
                  <dd className="font-mono text-white">{status.locationId}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-500">LSVT User</dt>
                  <dd className="font-mono text-white">{status.userId}</dd>
                </div>
              </dl>
              <div className="bg-[#BF0A30]/10 border border-[#BF0A30]/30 rounded-lg p-4 mb-6 flex gap-3">
                <ShieldAlert className="shrink-0 w-4 h-4 text-[#BF0A30] mt-0.5" aria-hidden="true" />
                <p className="text-xs text-gray-300 leading-relaxed">
                  When the trial ends, delete location <span className="font-mono text-white">{status.locationId}</span> in the LSVT admin to revoke access.
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                className={`inline-flex h-[52px] items-center justify-center rounded-full px-8 text-lg font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full ${hFont}`}
              >
                Create Another
              </button>
            </div>
          )}

          {/* Form */}
          {status.kind !== "success" && (
            <form
              onSubmit={onSubmit}
              className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-4"
            >
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={update("firstName")}
                  disabled={submitting}
                  autoComplete="given-name"
                />
                <Field
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={update("lastName")}
                  disabled={submitting}
                  autoComplete="family-name"
                />
              </div>
              <Field
                label="Email"
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                disabled={submitting}
                autoComplete="email"
              />
              <Field
                label="Phone"
                type="tel"
                value={form.phone}
                onChange={update("phone")}
                disabled={submitting}
                autoComplete="tel"
              />
              <Field
                label="Company"
                value={form.company}
                onChange={update("company")}
                disabled={submitting}
                autoComplete="organization"
              />

              {status.kind === "error" && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-[#BF0A30]/15 border border-[#BF0A30]/30">
                  <AlertCircle className="shrink-0 w-4 h-4 text-[#BF0A30] mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-[#FFB3C0]">{status.message}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className={`inline-flex h-[56px] items-center justify-center rounded-full px-8 text-lg font-bold tracking-[0.05em] cursor-pointer bg-[#BF0A30] text-white hover:bg-[#D91C40] active:bg-[#A00928] transition-colors duration-200 w-full disabled:opacity-60 disabled:cursor-wait ${hFont}`}
              >
                {submitting ? "Creating Trial…" : "Create Trial Account"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom tricolor */}
      <div className="h-1 flex shrink-0" aria-hidden="true">
        <div className="flex-1 bg-[#BF0A30]" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-[#0B2341]" />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  type = "text",
  value,
  onChange,
  disabled,
  autoComplete,
}: {
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className={`block text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-1.5 ${hFont}`}>
        {label}
        {required && <span className="text-[#BF0A30] ml-1">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-11 px-3 rounded-lg bg-[#0B2341] border border-white/15 text-white text-base focus:outline-none focus:border-[#BF0A30] focus:ring-1 focus:ring-[#BF0A30] disabled:opacity-50"
      />
    </label>
  );
}
