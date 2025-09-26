'use client'

import type { ExplainResponse } from '@/types/explain'
import CopyButton from './CopyButton'

type Props = {
  result: ExplainResponse | null
  selectedLine?: number
  onSelectLine?: (n: number) => void
}

export default function AnalysisPanel({ result, selectedLine, onSelectLine }: Props) {
  if (!result) {
    return (
      <div className="card">
        <p className="text-sm text-neutral-600">No analysis yet. Paste code and click “Explain Code”.</p>
      </div>
    )
  }

  const complexity = `Time: ${result.bigO?.time ?? 'n/a'}, Space: ${result.bigO?.space ?? 'n/a'}${
    result.bigO?.rationale ? `\nRationale: ${result.bigO.rationale}` : ''
  }`

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-semibold mb-2">By Line</h3>
        <ul className="space-y-2">
          {(result.byLine ?? []).map((item, idx) => (
            <li key={idx}>
              <button
                type="button"
                className={`w-full text-left rounded-md px-2 py-2 hover:bg-neutral-50 border ${
                  selectedLine === item.line ? 'bg-yellow-50 border-yellow-200' : 'border-transparent'
                }`}
                onClick={() => onSelectLine?.(item.line)}
              >
                <div className="text-sm">
                  <span className="font-mono chip mr-2">Line {item.line}</span>
                  <span className="font-medium">{item.explanation}</span>
                </div>
                <div className="text-xs mt-1 font-mono text-neutral-600 overflow-hidden text-ellipsis whitespace-nowrap">
                  {item.code}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Summary</h3>
          <CopyButton value={result.summary ?? ''} />
        </div>
        <p className="text-sm leading-6 text-neutral-800">{result.summary ?? '—'}</p>
      </div>

      <div className="card space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Complexity</h3>
          <CopyButton value={complexity} />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">Time: {result.bigO?.time ?? 'n/a'}</span>
          <span className="chip">Space: {result.bigO?.space ?? 'n/a'}</span>
        </div>
        {result.bigO?.rationale && (
          <p className="text-sm text-neutral-800">{result.bigO.rationale}</p>
        )}
      </div>

      {!!(result.potentialIssues?.length) && (
        <div className="card">
          <h3 className="font-semibold mb-2">Potential Issues</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {result.potentialIssues.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {!!(result.refactors?.length) && (
        <div className="card">
          <h3 className="font-semibold mb-2">Refactors</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {result.refactors.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}

      {!!(result.tests?.length) && (
        <div className="card">
          <h3 className="font-semibold mb-2">Suggested Tests</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {result.tests.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
