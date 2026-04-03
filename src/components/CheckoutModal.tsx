"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import CheckoutForm from "./CheckoutForm";

const hFont = "font-[family-name:var(--font-outfit)]";

export default function CheckoutModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[112px] pb-8 overflow-y-auto"
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-lg my-8"
        style={{ animation: "slideUp 0.3s ease-out" }}
      >
        <div className="relative bg-[#0a1628] text-white rounded-3xl p-7 sm:p-10 shadow-2xl shadow-black/40">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-200 cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[80px] bg-[#b71c1c]/20 rounded-full blur-[50px] pointer-events-none glow-bg"
            aria-hidden="true"
          />

          <div className="relative">
            {/* Price */}
            <div className="flex items-baseline justify-center gap-2 mb-1">
              <span className={`text-4xl sm:text-5xl font-black ${hFont}`}>
                $997
              </span>
              <span className="text-gray-500 text-base font-medium">
                /year
              </span>
            </div>
            <p className="text-center text-gray-500 text-sm mb-6">
              Full course access + coaching — billed annually
            </p>

            {/* Benefits */}
            <ul className="space-y-2 mb-6">
              {[
                "Full year of access to all 4 training modules",
                "Frameworks from Tom Howard & Trent Lowenstein",
                "Downloadable scripts, SOPs, and templates",
                "Access to the private RAG community",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-[#b71c1c] flex items-center justify-center">
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p className="text-sm text-gray-400">{item}</p>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className="h-px bg-white/10 mb-6" />

            {/* Checkout form */}
            <CheckoutForm />
          </div>
        </div>
      </div>
    </div>
  );
}
