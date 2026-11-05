import { useEffect } from "react";

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-ink/50 p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()} className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-md bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-md border border-line px-3 py-1 text-sm">Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
