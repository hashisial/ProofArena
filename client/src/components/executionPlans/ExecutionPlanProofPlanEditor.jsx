import { Plus, Trash2 } from "lucide-react";
import { PLAN_PROOF_TYPE_OPTIONS } from "../../features/executionPlans/executionPlanUtils.js";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const emptyProof = Object.freeze({
  description: "",
  proofType: "work_log",
  relatedMilestoneOrder: "",
  required: true,
  title: "",
});

export function ExecutionPlanProofPlanEditor({ error, items = [], onChange }) {
  const rows = items.length > 0 ? items : [emptyProof];

  function updateItem(index, field, value) {
    onChange(rows.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...rows, { ...emptyProof }]);
  }

  function removeItem(index) {
    onChange(rows.length === 1 ? [{ ...emptyProof }] : rows.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-4">
      {rows.map((item, index) => (
        <div className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={index}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-[#1C1917]">Proof item {index + 1}</p>
            <Button
              aria-label={`Remove proof item ${index + 1}`}
              onClick={() => removeItem(index)}
              type="button"
              variant="secondary"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <Input
            label="Proof title"
            onChange={(event) => updateItem(index, "title", event.target.value)}
            placeholder="CRM export"
            value={item.title}
          />
          <Textarea
            label="Description"
            onChange={(event) => updateItem(index, "description", event.target.value)}
            placeholder="Explain what evidence the client can review."
            rows={3}
            value={item.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Select
              label="Proof type"
              onChange={(event) => updateItem(index, "proofType", event.target.value)}
              options={PLAN_PROOF_TYPE_OPTIONS}
              placeholder=""
              value={item.proofType}
            />
            <Input
              label="Related milestone order"
              min="0"
              onChange={(event) => updateItem(index, "relatedMilestoneOrder", event.target.value)}
              placeholder="1"
              type="number"
              value={item.relatedMilestoneOrder}
            />
          </div>
          <Checkbox
            checked={item.required !== false}
            label="Required proof"
            onChange={(event) => updateItem(index, "required", event.target.checked)}
          />
        </div>
      ))}
      {error ? <p className="text-sm font-semibold text-[#DC2626]">{error}</p> : null}
      <Button className="w-full sm:w-auto" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add proof item
      </Button>
    </div>
  );
}
