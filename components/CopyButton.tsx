"use client";

import { useState } from "react";

export default function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={className ? className + " btn-secondary" : "btn-secondary"}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      aria-live="polite"
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
