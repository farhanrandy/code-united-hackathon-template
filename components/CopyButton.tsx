"use client";

import React, { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value ?? "");
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // ignore
        }
      }}
      aria-live="polite"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy"}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
