import { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { navFor, ROLE_LABELS } from "../../config/nav";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = navFor(user.role);

  const link = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-jade text-white" : "text-ink/80 hover:bg-jade-soft"}`;

  const nav = (
    <ul className="space-y-1">
      {items.map((n) => (
        <li key={n.to}>
          <NavLink to={n.to} end={n.end} className={link} onClick={() => setOpen(false)}>{n.label}</NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen md:grid md:grid-cols-[15rem_1fr]">
      <aside className="hidden border-r border-line bg-white p-4 md:block">
        <Link to="/" className="mb-6 block px-3 font-display text-lg font-bold text-jade">FairChain BD</Link>
        {nav}
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-line bg-white px-5">
          <button type="button" className="rounded-md border border-line px-3 py-1.5 text-sm md:hidden" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            {open ? "Close" : "Menu"}
          </button>
          <p className="hidden text-sm text-ink/70 md:block">
            Signed in as <span className="font-semibold text-ink">{user.username}</span> ({ROLE_LABELS[user.role] ?? user.role})
          </p>
          <button
            type="button"
            onClick={() => { logout(); navigate("/login", { replace: true }); }}
            className="rounded-md border border-ink/25 px-3 py-1.5 text-sm font-semibold hover:border-signal hover:text-signal"
          >
            Log out
          </button>
        </header>

        {open && <div className="border-b border-line bg-white p-4 md:hidden">{nav}</div>}

        <main className="mx-auto w-full max-w-6xl flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
