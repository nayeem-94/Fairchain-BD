import { useState } from "react";
import { errorMessage } from "../../api/client";

const TONES = {
  default: "border-ink/25 hover:border-jade hover:text-jade",
  good: "border-jade text-jade hover:bg-jade-soft",
  bad: "border-signal text-signal hover:bg-signal/10",
};

export default function ActionButton({ onClick, children, tone = "default" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setBusy(true);
    setError("");
    try { await onClick(); } catch (e) { setError(errorMessage(e)); } finally { setBusy(false); }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button type="button" onClick={run} disabled={busy} className={`rounded-md border px-3 py-1 text-xs font-semibold disabled:opacity-60 ${TONES[tone]}`}>
        {busy ? "Working" : children}
      </button>
      {error && <span role="alert" className="max-w-[16rem] text-xs text-signal">{error}</span>}
    </span>
  );
}
