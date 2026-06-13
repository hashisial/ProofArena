import { Plus, Trash2 } from "lucide-react";
import { PROOF_TYPE_OPTIONS } from "../../features/outcomeOffers/outcomeOfferUtils.js";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const starterProof = {
  description: "Evidence the client can review before the outcome is accepted.",
  proofType: "work_log",
  required: true,
  title: "Work log",
};

export function ProofIncludedEditor({ error, items = [], onChange }) {
  const proofItems = items.length > 0 ? items : [starterProof];

  function updateItem(index, patch) {
    onChange(proofItems.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...proofItems, { description: "", proofType: "document", required: true, title: "" }].slice(0, 20));
  }

  function removeItem(index) {
    onChange(proofItems.filter((_, itemIndex) => itemIndex !== index).slice(0, 20));
  }

  return (
    <section className="grid gap-4" aria-labelledby="proof-included-title">
      <div>
        <h3 className="text-lg font-black text-[#1C1917]" id="proof-included-title">Proof included</h3>
        <p className="mt-1 text-sm leading-6 text-[#78716C]">
          List the evidence clients will receive. File upload and Proof Vault come later.
        </p>
      </div>
      {error ? <p className="text-sm font-bold text-[#DC2626]" role="alert">{error}</p> : null}
      <div className="grid gap-4">
        {proofItems.map((item, index) => (
          <div className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={index}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-black text-[#3F6212]">Proof item {index + 1}</p>
              <button
                aria-label={`Remove proof item ${index + 1}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E7E5E4] bg-white text-[#78716C] transition hover:border-[#DC2626]/30 hover:text-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70 disabled:opacity-50"
                disabled={proofItems.length <= 1}
                onClick={() => removeItem(index)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Proof title"
                onChange={(event) => updateItem(index, { title: event.target.value })}
                placeholder="CRM sheet"
                value={item.title}
              />
              <Select
                label="Proof type"
                onChange={(event) => updateItem(index, { proofType: event.target.value })}
                options={PROOF_TYPE_OPTIONS}
                placeholder=""
                value={item.proofType}
              />
            </div>
            <Textarea
              label="Description"
              onChange={(event) => updateItem(index, { description: event.target.value })}
              placeholder="Explain what this proof shows."
              rows={3}
              value={item.description}
            />
            <Checkbox
              checked={item.required !== false}
              label="Required proof"
              onChange={(event) => updateItem(index, { required: event.target.checked })}
            />
          </div>
        ))}
      </div>
      <Button className="w-full sm:w-fit" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add proof item
      </Button>
    </section>
  );
}
