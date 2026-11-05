const TONES = [
  [/approved|accepted|resolved|active|read|delivered|completed|yes/i, "bg-jade-soft text-jade-dark"],
  [/pending|new|unread|reviewing|open|in.?transit/i, "bg-grain/20 text-ink"],
  [/rejected|inactive|dismissed|expired|failed/i, "bg-signal/15 text-signal"],
];

export default function StatusBadge({ value }) {
  const tone = TONES.find(([re]) => re.test(String(value)))?.[1] ?? "bg-ink/10 text-ink";
  return <span className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${tone}`}>{String(value)}</span>;
}
