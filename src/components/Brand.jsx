export function Mark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="12" cy="16" r="8" fill="none" stroke="#0F5B43" strokeWidth="4" />
      <circle cx="21" cy="16" r="6" fill="#C2302A" />
    </svg>
  )
}

export default function Brand({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2 font-display text-[20px] font-bold tracking-tight ${className}`}>
      <Mark />
      FairChain BD
    </span>
  )
}
