import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const emptyMilestone = Object.freeze({
  deliverable: "",
  description: "",
  expectedDueDay: "",
  proofPlanned: true,
  title: "",
});

export function ExecutionPlanMilestonesEditor({ error, items = [], onChange }) {
  const rows = items.length > 0 ? items : [emptyMilestone];

  function updateItem(index, field, value) {
    onChange(rows.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)));
  }

  function addItem() {
    onChange([...rows, { ...emptyMilestone }]);
  }

  function removeItem(index) {
    onChange(rows.length === 1 ? [{ ...emptyMilestone }] : rows.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="grid gap-4">
      {rows.map((item, index) => (
        <div className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-[#FEFCE8] p-4" key={index}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-black text-[#1C1917]">Milestone {index + 1}</p>
            <Button
              aria-label={`Remove milestone ${index + 1}`}
              onClick={() => removeItem(index)}
              type="button"
              variant="secondary"
            >
              <Trash2 aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
          <Input
            label="Milestone title"
            onChange={(event) => updateItem(index, "title", event.target.value)}
            placeholder="First delivery checkpoint"
            value={item.title}
          />
          <Textarea
            label="Description"
            onChange={(event) => updateItem(index, "description", event.target.value)}
            placeholder="Explain what happens during this milestone."
            rows={3}
            value={item.description}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Expected due day"
              min="1"
              onChange={(event) => updateItem(index, "expectedDueDay", event.target.value)}
              placeholder="7"
              type="number"
              value={item.expectedDueDay}
            />
            <Input
              label="Deliverable"
              onChange={(event) => updateItem(index, "deliverable", event.target.value)}
              placeholder="Cleaned batch and proof notes"
              value={item.deliverable}
            />
          </div>
          <Checkbox
            checked={Boolean(item.proofPlanned)}
            label="Proof planned for this milestone"
            onChange={(event) => updateItem(index, "proofPlanned", event.target.checked)}
          />
        </div>
      ))}
      {error ? <p className="text-sm font-semibold text-[#DC2626]">{error}</p> : null}
      <Button className="w-full sm:w-auto" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add milestone
      </Button>
    </div>
  );
}
