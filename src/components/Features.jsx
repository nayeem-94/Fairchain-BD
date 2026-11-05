import CitizenReportForm from "./CitizenReportForm";

const FEATURES = [
  ["Fair price checks", "Every market price is set against an admin-approved reference price."],
  ["Batch tracking", "Follow a batch through each transfer, from importer to retailer."],
  ["Expiry alerts", "Get warned before stock expires so it can be sold or pulled in time."],
  ["Price forecasts", "A forecasting model estimates the price for the coming weeks."],
  ["Citizen reports", "Anyone can report overpricing, and admins update the status."],
  ["Admin dashboard", "Admins see reports, transfers, prices and alerts in one place."],
];

export default function Features({ products }) {
  return (
    <section id="features" className="scroll-mt-16 border-b border-line">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">Features</h2>
          <p className="mt-2 max-w-md text-ink/70">Tools for the people who move food, and the people who buy it.</p>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            {FEATURES.map(([title, body]) => (
              <div key={title} className="py-4 sm:grid sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="font-semibold text-jade">{title}</dt>
                <dd className="mt-1 text-ink/75 sm:mt-0">{body}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div id="report" className="scroll-mt-20">
          <CitizenReportForm products={products} />
        </div>
      </div>
    </section>
  );
}
