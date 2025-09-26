"use client";

import { useEffect, useMemo, useState } from "react";
import type { ExplainRequest, ExplainResponse } from "@/types/explain";
import CodeViewer from "@/components/CodeViewer";
import AnalysisPanel from "@/components/AnalysisPanel";

const SAMPLE = `function sumUnique(arr) { const set = new Set(arr); let sum = 0; for (const v of set) sum += v; return sum; }\nconsole.log(sumUnique([1,2,2,3]));`;

export default function Page() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<ExplainRequest["language"]>("auto");
  const [depth, setDepth] =
    useState<NonNullable<ExplainRequest["depth"]>>("detailed");
  const [selectedLine, setSelectedLine] = useState<number | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainResponse | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<
    "en" | "id" | "su" | "ja" | "de"
  >("en");

  const canSubmit = useMemo(
    () => code.trim().length > 0 && !loading,
    [code, loading]
  );

  useEffect(() => {
    if (selectedLine) {
      const el = document.getElementById(`code-line-${selectedLine}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [selectedLine]);

  async function onExplain() {
    setLoading(true);
    setError(null);
    setSelectedLine(undefined);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          autodetect: language === "auto",
          depth,
          targetLanguage,
        } satisfies ExplainRequest),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = (await res.json()) as ExplainResponse;
      setResult(data);
    } catch (e) {
      setError("Failed to fetch explanation. Using mock if available.");
      try {
        const res = await fetch("/api/explain", {
          method: "POST",
          body: JSON.stringify({ code: "x" }),
        });
        if (res.ok) setResult((await res.json()) as ExplainResponse);
      } catch {}
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Code Explainer</h1>
        <p className="text-neutral-600">
          Paste snippet → line-by-line explanation + complexity
        </p>
      </header>

      <section
        className="card space-y-4"
        aria-busy={loading}
        aria-live="polite"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="language" className="text-sm font-medium">
              Language
            </label>
            <select
              id="language"
              className="border rounded-md px-3 py-2 text-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
            >
              <option value="auto">Auto-detect</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="java">Java</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="depth" className="text-sm font-medium">
              Depth
            </label>
            <select
              id="depth"
              className="border rounded-md px-3 py-2 text-sm"
              value={depth}
              onChange={(e) => setDepth(e.target.value as any)}
            >
              <option value="brief">Brief</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="targetLanguage" className="text-sm font-medium">
              Explanation language
            </label>
            <select
              id="targetLanguage"
              className="border rounded p-2"
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value as any)}
            >
              <option value="en">English</option>
              <option value="id">Indonesia</option>
              <option value="su">Sunda</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="de">Deutsch (German)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="code" className="text-sm font-medium">
            Your code
          </label>
          <textarea
            id="code"
            className="font-mono bg-neutral-50 text-neutral-800 overflow-auto text-sm sm:text-[13px] whitespace-pre border rounded-md min-h-[160px] p-3"
            placeholder="Paste your code here…"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <div className="flex items-center gap-3">
            <button className="btn" onClick={onExplain} disabled={!canSubmit}>
              {loading ? "Explaining…" : "Explain Code"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setCode(SAMPLE)}
            >
              Use sample
            </button>
            <span className="text-xs text-neutral-600">
              We don’t store your code.
            </span>
          </div>
        </div>
        {error && (
          <div className="rounded-md bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CodeViewer
          code={code || SAMPLE}
          selectedLine={selectedLine}
          onSelectLine={setSelectedLine}
        />
        <AnalysisPanel
          result={result}
          selectedLine={selectedLine}
          onSelectLine={(n) => {
            setSelectedLine(n);
            // Scroll code panel line into view on the client
            // (basic approach; DOM refs can refine if needed)
          }}
        />
      </section>

      <footer className="text-center text-xs text-neutral-500">
        Demo-only • No code is stored
      </footer>
    </main>
  );
}
