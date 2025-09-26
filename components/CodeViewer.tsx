'use client'

type Props = {
  code: string
  selectedLine?: number
  onSelectLine?: (n: number) => void
}

export default function CodeViewer({ code, selectedLine, onSelectLine }: Props) {
  const lines = code.split('\n')
  return (
    <div className="card">
      <div className="font-mono bg-neutral-50 text-neutral-800 overflow-auto text-sm sm:text-[13px] whitespace-pre">
        <div className="grid" style={{ gridTemplateColumns: 'auto 1fr' }}>
          {lines.map((content, i) => {
            const lineNo = i + 1
            const isSelected = selectedLine === lineNo
            return (
              <div key={i} className={`contents`}>
                <button
                  type="button"
                  onClick={() => onSelectLine?.(lineNo)}
                  className={`px-3 py-1 text-right select-none border-r bg-neutral-100/60 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 ${
                    isSelected ? 'bg-yellow-50 text-neutral-900 font-semibold' : ''
                  }`}
                  aria-label={`Select line ${lineNo}`}
                >
                  {lineNo}
                </button>
                <pre id={`code-line-${lineNo}`} className={`px-3 py-1 ${isSelected ? 'bg-yellow-50' : ''}`}>
                  <code>{content || ' '}</code>
                </pre>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
