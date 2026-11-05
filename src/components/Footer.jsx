export default function Footer() {
  return (
    <footer className="bg-ink text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-bold text-white">FairChain BD</p>
          <p className="mt-2 text-sm">Transparent prices and traceable supply chains for essential goods in Bangladesh.</p>
        </div>
        <ul className="flex gap-8 text-sm">
          <li><a className="hover:text-white" href="#insights">Market insights</a></li>
          <li><a className="hover:text-white" href="#how-it-works">How it works</a></li>
          <li><a className="hover:text-white" href="#report">Report a price</a></li>
          <li><a className="hover:text-white" href="/login">Login</a></li>
        </ul>
      </div>
      <p className="border-t border-white/15 py-4 text-center text-xs">© 2026 FairChain BD</p>
    </footer>
  );
}
