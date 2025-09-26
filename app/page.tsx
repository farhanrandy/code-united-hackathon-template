"use client";

import { useEffect, useMemo, useState } from "react";
import AnalysisPanel from "@/components/AnalysisPanel";
import CodeViewer from "@/components/CodeViewer";
import CopyButton from "@/components/CopyButton";

const SAMPLE = `function sumUnique(arr) { const set = new Set(arr); let sum = 0; for (const v of set) sum += v; return sum; }\nconsole.log(sumUnique([1,2,2,3]));`;

export default function Page() {
  const [code, setCode] = useState<string>(""); // or existing initial
  const [language, setLanguage] = useState<
    "auto" | "javascript" | "typescript" | "python" | "go" | "java"
  >("auto");
  const [depth, setDepth] = useState<"brief" | "detailed">("detailed");
  const [targetLanguage, setTargetLanguage] = useState<
    "en" | "id" | "su" | "ja" | "de"
  >("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [selectedLine, setSelectedLine] = useState<number | undefined>(
    undefined
  );

  function cx(...cls: Array<string | false | undefined>) {
    return cls.filter(Boolean).join(" ");
  }

  async function onExplain() {
    setLoading(true);
    setError(null);
    setResult(null);
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
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError("Failed to explain code. Showing mock if available.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Code Explainer</h1>
        <p className="text-neutral-500">
          Paste snippet → line-by-line explanation + complexity
        </p>
      </header>

      <section className="rounded-xl border shadow-sm bg-white p-4 sm:p-6 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {/* Language */}
          <div className="flex flex-col gap-1">
            <label htmlFor="language" className="text-sm font-medium">
              Language
            </label>
            <select
              id="language"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-neutral-400"
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

          {/* Depth */}
          <div className="flex flex-col gap-1">
            <label htmlFor="depth" className="text-sm font-medium">
              Depth
            </label>
            <select
              id="depth"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
              value={depth}
              onChange={(e) => setDepth(e.target.value as any)}
            >
              <option value="brief">Brief</option>
              <option value="detailed">Detailed</option>
            </select>
          </div>

          {/* Explanation language */}
          <div className="flex flex-col gap-1">
            <label htmlFor="targetLanguage" className="text-sm font-medium">
              Explanation language
            </label>
            <select
              id="targetLanguage"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
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

        {/* Code input */}
        <div>
          <label htmlFor="code" className="sr-only">
            Your code
          </label>
          <textarea
            id="code"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 placeholder:text-neutral-400 font-mono min-h-[160px]"
            placeholder="Paste your code here…"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <p className="mt-2 text-sm text-neutral-500">
            We don’t store your code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExplain}
            disabled={!code.trim() || loading}
            className="inline-flex items-center gap-2 rounded-lg bg-black text-white px-4 py-2 hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-transparent" />
                Explaining…
              </>
            ) : (
              "Explain Code"
            )}
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-black/10"
            onClick={() =>
              setCode(
                "function sumUnique(arr) { const set = new Set(arr); let sum = 0; for (const v of set) sum += v; return sum; }\nconsole.log(sumUnique([1,2,2,3]));"
              )
            }
          >
            Use sample
          </button>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Code */}
        <div className="rounded-xl border shadow-sm bg-white p-4 sm:p-6 min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">Code</h2>
          <div className="border rounded-lg overflow-hidden">
            <CodeViewer
              code={code}
              selectedLine={selectedLine}
              onSelectLine={setSelectedLine}
            />
          </div>
        </div>

        {/* Right: Analysis */}
        <div className="rounded-xl border shadow-sm bg-white p-4 sm:p-6 min-w-0">
          <h2 className="text-2xl font-semibold tracking-tight mb-3">
            Analysis
          </h2>
          <AnalysisPanel
            result={result}
            selectedLine={selectedLine}
            onSelectLine={setSelectedLine}
            loading={loading}
          />
        </div>
      </section>

      <footer className="text-sm text-neutral-500">
        Demo-only • No code is stored
      </footer>
    </main>
  );
}
