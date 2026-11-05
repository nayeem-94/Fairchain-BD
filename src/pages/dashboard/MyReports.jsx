import { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import Modal from "../../components/ui/Modal";
import { humanize } from "../../components/ui/DataTable";
import { BTN_OUTLINE } from "../../components/ui/styles";
import { errorMessage } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { useProducts } from "../../hooks/useProducts";

function ReportDetail({ id, onClose }) {
  const { data, loading, error } = useApi(`/citizen-reports/${id}/`);
  return (
    <Modal title={`Report #${id}`} onClose={onClose}>
      {loading ? <p className="text-sm text-ink/60">Loading</p>
        : error ? <p role="alert" className="text-sm text-signal">{errorMessage(error)}</p>
        : (
          <dl className="space-y-2">
            {Object.entries(data ?? {}).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-line pb-2 text-sm">
                <dt className="text-ink/70">{humanize(k)}</dt>
                <dd className="text-right font-semibold">{typeof v === "object" && v !== null ? JSON.stringify(v) : String(v ?? "–")}</dd>
              </div>
            ))}
          </dl>
        )}
    </Modal>
  );
}

export default function MyReports() {
  const { options } = useProducts();
  const [openId, setOpenId] = useState(null);

  return (
    <>
      <PageHeader title="My reports">Overpricing you have reported, and what admins decided.</PageHeader>
      <ResourcePanel
        title="My reports"
        path="/citizen-reports/"
        empty="You have not reported anything yet. Use Submit report to add the first one."
        form={{
          label: "Submit report",
          submitLabel: "Submit report",
          // Field names are a guess. Match them to your CitizenReport serializer.
          fields: [
            { name: "product", label: "Product", type: "select", options },
            { name: "location", label: "Shop or market" },
            { name: "price", label: "Price you were charged (৳)", type: "number", step: "0.01" },
            { name: "description", label: "Details", type: "textarea", required: false },
          ],
        }}
        actions={(row) => <button type="button" className={BTN_OUTLINE} onClick={() => setOpenId(row.id)}>View</button>}
      />
      {openId != null && <ReportDetail id={openId} onClose={() => setOpenId(null)} />}
    </>
  );
}
