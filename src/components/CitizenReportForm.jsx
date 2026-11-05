import { useState } from "react";
import { api, getToken } from "../api/client";

const FIELD =
  "w-full rounded-md border border-line bg-white px-3 py-2 focus:border-jade focus:outline-none focus:ring-2 focus:ring-jade/30";

export default function CitizenReportForm({ products }) {
  const [form, setForm] = useState({ product: "", location: "", price: "", description: "" });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!getToken()) {
      setStatus({ type: "auth", message: "Log in to submit a report." });
      return;
    }
    setStatus({ type: "sending", message: "" });
    try {
      // Field names are a guess. Match them to your CitizenReport serializer.
      await api("/citizen-reports/", {
        method: "POST",
        body: { ...form, product: Number(form.product), price: Number(form.price) },
      });
      setForm({ product: "", location: "", price: "", description: "" });
      setStatus({ type: "success", message: "Report submitted. You can track it under My reports." });
    } catch (err) {
      setStatus({
        type: "error",
        message: err.status === 401 ? "Your session has expired. Log in again to submit." : "The report was not sent. Check the fields and try again.",
      });
    }
  }

  return (
    <form onSubmit={submit} className="rounded-md border border-line bg-white p-5" noValidate>
      <h3 className="font-display text-xl font-bold">Report an overpriced item</h3>
      <p className="mt-1 text-sm text-ink/70">Tell us what you saw and where. Admins review every report.</p>

      <div className="mt-5 space-y-4">
        <label className="block text-sm font-medium">
          Product
          <select required value={form.product} onChange={set("product")} className={`${FIELD} mt-1`}>
            <option value="" disabled>Select a product</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Shop or market
            <input required value={form.location} onChange={set("location")} placeholder="e.g. Karwan Bazar" className={`${FIELD} mt-1`} />
          </label>
          <label className="block text-sm font-medium">
            Price you were charged (৳)
            <input required type="number" min="0" step="0.1" value={form.price} onChange={set("price")} className={`${FIELD} mt-1`} />
          </label>
        </div>

        <label className="block text-sm font-medium">
          Details
          <textarea rows={3} value={form.description} onChange={set("description")} placeholder="What happened?" className={`${FIELD} mt-1`} />
        </label>
      </div>

      <button
        type="submit"
        disabled={status.type === "sending"}
        className="mt-5 rounded-md bg-jade px-5 py-2.5 font-semibold text-white hover:bg-jade-dark disabled:opacity-60"
      >
        {status.type === "sending" ? "Submitting report" : "Submit report"}
      </button>

      <p role="status" className={`mt-3 text-sm ${status.type === "success" ? "text-jade" : "text-signal"}`}>
        {status.message}
        {status.type === "auth" && <> <a href="/login" className="font-semibold underline">Go to login</a></>}
      </p>
    </form>
  );
}
