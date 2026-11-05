import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen md:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-jade p-10 text-white md:flex">
        <Link to="/" className="font-display text-xl font-bold">FairChain BD</Link>
        <div>
          <p className="max-w-sm font-display text-3xl font-bold leading-tight">Every price on record. Every batch accounted for.</p>
          <p className="mt-4 max-w-sm text-white/75">Sign in to log shipments, move stock, check fair prices and follow reports from your area.</p>
        </div>
        <p className="text-sm text-white/60">© 2026 FairChain BD</p>
      </aside>

      <main className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 block font-display text-lg font-bold text-jade md:hidden">FairChain BD</Link>
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-2 text-ink/70">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <p className="mt-6 text-sm text-ink/70">{footer}</p>}
        </div>
      </main>
    </div>
  );
}
