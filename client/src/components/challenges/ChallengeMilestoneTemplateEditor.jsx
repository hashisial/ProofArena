import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";

export function ChallengeMilestoneTemplateEditor({ items = [], onChange }) {
  const milestones = items.length > 0 ? items : [];

  function updateItem(index, patch) {
    onChange(milestones.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...milestones, { description: "", expectedDueDay: "", proofRequired: false, title: "" }].slice(0, 20));
  }

  function removeItem(index) {
    onChange(milestones.filter((_, itemIndex) => itemIndex !== index).slice(0, 20));
  }

  return (
    <section className="grid gap-4" aria-labelledby="challenge-milestones-title">
      <div>
        <h3 className="text-lg font-black text-[#1C1917]" id="challenge-milestones-title">
          Milestone template
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#78716C]">
          Set the expected delivery path. Actual milestone workspace comes later.
        </p>
      </div>
      <div className="grid gap-4">
        {milestones.map((item, index) => (
          <div className="grid gap-4 rounded-2xl border border-[#E7E5E4] bg-[#FFFBEB] p-4" key={index}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-black text-[#3F6212]">Milestone {index + 1}</p>
              <button
                aria-label={`Remove milestone ${index + 1}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E7E5E4] bg-white text-[#78716C] transition hover:border-[#DC2626]/30 hover:text-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                onClick={() => removeItem(index)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
              <Input
                label="Milestone title"
                onChange={(event) => updateItem(index, { title: event.target.value })}
                placeholder="Setup and requirements confirmation"
                value={item.title}
              />
              <Input
                label="Expected due day"
                min="1"
                onChange={(event) => updateItem(index, { expectedDueDay: event.target.value })}
                placeholder="7"
                type="number"
                value={item.expectedDueDay}
              />
            </div>
            <Textarea
              label="Description"
              onChange={(event) => updateItem(index, { description: event.target.value })}
              placeholder="Describe what should be completed at this checkpoint."
              rows={3}
              value={item.description}
            />
            <Checkbox
              checked={Boolean(item.proofRequired)}
              label="Proof required at this milestone"
              onChange={(event) => updateItem(index, { proofRequired: event.target.checked })}
            />
          </div>
        ))}
      </div>
      <Button className="w-full sm:w-fit" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add milestone
      </Button>
    </section>
  );
}
