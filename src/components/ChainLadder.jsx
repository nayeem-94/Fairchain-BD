import { bdt, pct, num } from '../lib/format.js'

/**
 * The price ladder: one bar per step of the supply chain.
 * Green = the part of the price up to the fair price, red = the part above it.
 * steps: [{ label, sub?, price }]   fair: number | null
 */
export default function ChainLadder({ steps, fair, height = 220, animate = false, unit = '' }) {
  if (!steps?.length) return null
  const top = Math.max(...steps.map((s) => num(s.price)), num(fair)) * 1.2 || 1
  const y = (v) => (num(v) / top) * height
  const summary = steps.map((s) => `${s.label} ${bdt(s.price)}`).join(', ')

  return (
    <div role="img" aria-label={`Price at each step: ${summary}${fair ? `. Fair price ${bdt(fair)}` : ''}`}>
      <div className="relative flex items-end gap-2 sm:gap-4" style={{ height }}>
        {fair > 0 && (
          <div className="pointer-events-none absolute left-0 right-0 border-t-2 border-dashed border-ink/50" style={{ bottom: y(fair) }}>
            <span className="absolute right-0 -translate-y-full bg-paper px-1.5 text-xs font-medium text-ink">
              Fair price {bdt(fair)}{unit && ` / ${unit}`}
            </span>
          </div>
        )}
        {steps.map((s, i) => {
          const p = num(s.price)
          const base = fair > 0 ? Math.min(p, fair) : p
          const over = fair > 0 && p > fair ? p - fair : 0
          return (
            <div key={i} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-[13px] font-semibold sm:text-sm">{bdt(p)}</span>
              <div
                className={`flex w-full max-w-[84px] flex-col justify-end overflow-hidden rounded-t ${animate ? 'ladder-bar' : ''}`}
                style={{ height: y(p), animationDelay: `${i * 110}ms` }}
              >
                {over > 0 && <div className="bg-sun" style={{ height: y(over) }} />}
                <div className="bg-paddy" style={{ height: y(base) }} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-2 flex gap-2 border-t border-ink/70 pt-2 sm:gap-4">
        {steps.map((s, i) => {
          const prev = i > 0 ? num(steps[i - 1].price) : 0
          const change = prev ? ((num(s.price) - prev) / prev) * 100 : null
          return (
            <div key={i} className="min-w-0 flex-1 text-center">
              <div className="truncate text-[13px] font-semibold sm:text-sm">{s.label}</div>
              {s.sub && <div className="truncate text-xs text-mute">{s.sub}</div>}
              {change !== null && (
                <div className={`text-xs font-medium ${change > 10 ? 'text-sun' : 'text-mute'}`}>{pct(change)}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
