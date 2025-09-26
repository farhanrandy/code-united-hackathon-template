"use client";

import React from "react";
import CopyButton from "./CopyButton";
import type { ExplainResponse } from "@/types/explain";

type Props = {
  result: ExplainResponse | null;
  selectedLine?: number;
  onSelectLine?: (n: number) => void;
  loading?: boolean;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

function SkeletonLines({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-4 bg-neutral-200 rounded animate-pulse" />
      ))}
    </div>
  );
}

export default function AnalysisPanel({
  result,
  selectedLine,
  onSelectLine,
  loading,
}: Props) {
  if (loading) {
    return (
      <div className="space-y-4">
        <Section title="Summary">
          <SkeletonLines rows={3} />
        </Section>
        <Section title="Complexity">
          <div className="flex gap-2">
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs w-16 h-5 bg-neutral-200 animate-pulse" />
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs w-20 h-5 bg-neutral-200 animate-pulse" />
          </div>
          <div className="mt-2">
            <SkeletonLines rows={2} />
          </div>
        </Section>
        <Section title="By Line">
          <SkeletonLines rows={5} />
        </Section>
      </div>
    );
  }

  if (!result) {
    return (
      <p className="text-neutral-500 text-[15px]">
        No analysis yet. Paste code and click Explain.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <Section title="Summary">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] leading-7 text-neutral-800">
            {result.summary}
          </p>
          <CopyButton value={result.summary} />
        </div>
      </Section>

      <Section title="Complexity">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs border-neutral-300 text-neutral-700">
            Time: {result.bigO?.time ?? "-"}
          </span>
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs border-neutral-300 text-neutral-700">
            Space: {result.bigO?.space ?? "-"}
          </span>
          <CopyButton
            value={`Time: ${result.bigO?.time ?? "-"} | Space: ${
              result.bigO?.space ?? "-"
            }${result.bigO?.rationale ? `\nRationale: ${result.bigO.rationale}` : ""}`}
          />
        </div>
        {result.bigO?.rationale && (
          <p className="text-[15px] leading-7 text-neutral-800 mt-2">
            {result.bigO.rationale}
          </p>
        )}
      </Section>

      <Section title="By Line">
        <ul className="space-y-2">
          {(result.byLine ?? []).map((item, i) => (
            <li key={`${item.line}-${i}`}>
              <button
                type="button"
                onClick={() => onSelectLine?.(item.line)}
                className="w-full text-left rounded-lg px-3 py-2 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10"
                aria-label={`Focus line ${item.line}`}
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs border-neutral-300 text-neutral-700">
                    #{item.line}
                  </span>
                  <div className="flex-1">
                    <div className="font-mono text-[13px] text-neutral-800">
                      {item.code}
                    </div>
                    <div className="text-[15px] leading-7 text-neutral-800">
                      {item.explanation}
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </Section>

      {result.potentialIssues?.length ? (
        <Section title="Potential Issues">
          <ul className="list-disc pl-5 space-y-1 text-[15px] leading-7 text-neutral-800">
            {result.potentialIssues.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {result.refactors?.length ? (
        <Section title="Refactors">
          <ul className="list-disc pl-5 space-y-1 text-[15px] leading-7 text-neutral-800">
            {result.refactors.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      {result.tests?.length ? (
        <Section title="Suggested Tests">
          <ul className="list-disc pl-5 space-y-1 text-[15px] leading-7 text-neutral-800">
            {result.tests.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Section>
      ) : null}
    </div>
  );
}
