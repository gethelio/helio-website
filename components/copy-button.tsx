"use client";

import { useState } from "react";

export default function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; silently no-op
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white"
      aria-label={copied ? "Copied to clipboard" : `Copy: ${text}`}
    >
      {copied ? (
        <>
          <svg
            className="h-3.5 w-3.5 fill-emerald-400"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M13.7 3.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 011.4-1.4L6 9.6l6.3-6.3a1 1 0 011.4 0z" />
          </svg>
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <svg
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M4 0a2 2 0 00-2 2v9h2V2h7V0H4zm3 4a2 2 0 00-2 2v8a2 2 0 002 2h7a2 2 0 002-2V6a2 2 0 00-2-2H7zm0 2h7v8H7V6z" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
