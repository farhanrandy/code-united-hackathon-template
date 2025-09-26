"use client";

import React, { useMemo } from "react";

type Props = {
  code: string;
  selectedLine?: number;
  onSelectLine?: (n: number) => void;
};

function cx(...cls: Array<string | false | undefined>) {
  return cls.filter(Boolean).join(" ");
}

export default function CodeViewer({ code, selectedLine, onSelectLine }: Props) {
  const lines = useMemo(() => code.replace(/\r\n/g, "\n").split("\n"), [code]);

  return (
    <pre className="font-mono bg-neutral-50 text-neutral-800 overflow-auto text-sm sm:text-[13px] whitespace-pre max-h-[60vh]">
      <code className="block min-w-full">
        {lines.map((line, idx) => {
          const n = idx + 1;
          const isSelected = selectedLine === n;
          return (
            <div
              key={n}
              id={`code-line-${n}`}
              className={cx(
                "flex items-start gap-3 px-3",
                "border-b last:border-b-0 border-neutral-100",
                "min-w-full",
                "focus-within:ring-1 focus-within:ring-black/10",
                isSelected && "bg-yellow-50 ring-1 ring-yellow-200",
                !isSelected && "hover:bg-neutral-100"
              )}
            >
              <button
                type="button"
                onClick={() => onSelectLine?.(n)}
                className={cx(
                  "select-none text-neutral-500 pr-3 border-r mr-3",
                  "sticky left-0 bg-neutral-50",
                  "text-right w-10 shrink-0",
                  "focus:outline-none focus:ring-2 focus:ring-black/20"
                )}
                aria-label={`Select line ${n}`}
                tabIndex={0}
              >
                {n}
              </button>
              <span className="whitespace-pre-wrap break-words flex-1">{line || " "}</span>
            </div>
          );
        })}
      </code>
    </pre>
  );
}
