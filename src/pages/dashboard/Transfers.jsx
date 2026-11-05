
import PageHeader from "../../components/ui/PageHeader";
import ResourcePanel from "../../components/ResourcePanel";
import ActionButton from "../../components/ui/ActionButton";
import { api } from "../../api/client";
import { useApi } from "../../hooks/useApi";
import { asList } from "../../api/normalize";

export default function Transfers() {
  const { data } = useApi("/api/products/batches/");

  const batches = asList(data).map((b) => ({
    value: b.id,
    label: `Batch #${b.id}${b.batch_number ? ` (${b.batch_number})` : ""}`,
  }));

  const decide = (id, verb, reload) => async () => {
    try {
      await api(`/api/products/transfers/${id}/${verb}/`, {
        method: "POST",
      });

      reload();
    } catch (error) {
      console.error(`Transfer ${verb} failed:`, error);
      alert(`Could not ${verb} transfer. Please try again.`);
    }
  };

  return (
    <>
      <PageHeader title="Transfers">
        Send stock to the next holder, and accept or reject what is sent to you.
      </PageHeader>

      <ResourcePanel
        title="Transfer history"
        path="/api/products/transfers/"
        form={{
          label: "Send product",
          submitLabel: "Send transfer",
          fields: [
            {
              name: "batch",
              label: "Batch",
              type: "select",
              options: batches,
              required: true,
            },
            {
              name: "to_user",
              label: "Receiver user ID",
              type: "number",
              required: true,
            },
            {
              name: "quantity",
              label: "Quantity",
              type: "number",
              step: "0.01",
              required: true,
            },
            {
              name: "price_at_transfer",
              label: "Price at transfer",
              type: "number",
              step: "0.01",
              required: true,
            },
          ],
        }}
        actions={(row, reload) =>
          String(row.status ?? "").toLowerCase() === "pending" ? (
            <span className="flex gap-2">
              <ActionButton
                tone="good"
                onClick={decide(row.id, "accept", reload)}
              >
                Accept
              </ActionButton>

              <ActionButton
                tone="bad"
                onClick={decide(row.id, "reject", reload)}
              >
                Reject
              </ActionButton>
            </span>
          ) : null
        }
      />
    </>
  );
}
