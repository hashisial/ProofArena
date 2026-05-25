import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const emptyRisk = Object.freeze({
  mitigation: "",
  risk: "",
});

export function RiskHandlingEditor({ items = [], onChange }) {
  const rows = items.length > 0 ? items : [emptyRisk];

  function updateItem(index, field, value) {
    onChange(rows.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...rows, { ...emptyRisk }]);
  }

  function removeItem(index) {
    onChange(rows.length === 1 ? [{ ...emptyRisk }] : rows.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-4">
      {rows.map((item, index) => (
        <div className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={index}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-[#1C1917]">Risk {index + 1}</p>
            <Button
              aria-label={`Remove risk ${index + 1}`}
              onClick={() => removeItem(index)}
              type="button"
              variant="secondary"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <Input
            label="Risk"
            onChange={(event) => updateItem(index, "risk", event.target.value)}
            placeholder="Lead data contains duplicates"
            value={item.risk}
          />
          <Textarea
            label="Mitigation"
            onChange={(event) => updateItem(index, "mitigation", event.target.value)}
            placeholder="I will run duplicate checks before CRM upload."
            rows={3}
            value={item.mitigation}
          />
        </div>
      ))}
      <Button className="w-full sm:w-auto" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add risk
      </Button>
    </div>
  );
}
