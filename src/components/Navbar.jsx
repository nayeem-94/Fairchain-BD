import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const LINKS = [
  ["Home", "#home"],
  ["Features", "#features"],
  ["How it works", "#how-it-works"],
];

function LogoMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <rect x="2" y="9" width="15" height="10" rx="5" />
      <rect x="11" y="9" width="15" height="10" rx="5" />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const to = user ? "/dashboard" : "/login";
  const label = user ? "Dashboard" : "Login";

  return (
    <header className="sticky top-0 z-[1100] border-b border-line bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5" aria-label="Main">
        <a href="#home" className="flex items-center gap-2 font-display text-xl font-bold text-jade">
          <LogoMark /> FairChain BD
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} className="text-sm font-medium text-ink/75 hover:text-jade">{label}</a>
            </li>
          ))}
          <li>
            <a href={to} className="rounded-md bg-jade px-4 py-2 text-sm font-semibold text-white hover:bg-jade-dark">
              {label}
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="rounded-md border border-line px-3 py-2 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-line bg-paper px-5 py-3 md:hidden">
          {LINKS.map(([label, href]) => (
            <li key={href}>
              <a href={href} onClick={() => setOpen(false)} className="block py-2 text-ink/80">{label}</a>
            </li>
          ))}
          <li>
            <a href={to} className="mt-2 block rounded-md bg-jade py-2 text-center font-semibold text-white">{label}</a>
          </li>
        </ul>
      )}
    </header>
  );
}
