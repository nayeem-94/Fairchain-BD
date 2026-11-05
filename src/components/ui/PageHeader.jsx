export default function PageHeader({ title, children }) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-3xl font-bold">{title}</h1>
      {children && <p className="mt-1 max-w-2xl text-ink/70">{children}</p>}
    </div>
  );
}
