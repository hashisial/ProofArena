import { Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Checkbox } from "../ui/Checkbox.jsx";
import { Input } from "../ui/Input.jsx";
import { Textarea } from "../ui/Textarea.jsx";

const starterCriterion = {
  description: "Define what must be true for this outcome to count as completed.",
  required: true,
  title: "Qualified result requirements",
};

export function SuccessCriteriaEditor({ error, items = [], onChange }) {
  const criteria = items.length > 0 ? items : [starterCriterion];

  function updateItem(index, patch) {
    onChange(criteria.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    onChange([...criteria, { description: "", required: true, title: "" }].slice(0, 20));
  }

  function removeItem(index) {
    onChange(criteria.filter((_, itemIndex) => itemIndex !== index).slice(0, 20));
  }

  return (
    <section className="grid gap-4" aria-labelledby="success-criteria-title">
      <div>
        <h3 className="text-lg font-black text-[#07030D]" id="success-criteria-title">Success criteria</h3>
        <p className="mt-1 text-sm leading-6 text-[#6F657C]">
          Define what must be true before the outcome counts as complete.
        </p>
      </div>
      {error ? <p className="text-sm font-bold text-[#DC2626]" role="alert">{error}</p> : null}
      <div className="grid gap-4">
        {criteria.map((item, index) => (
          <div className="grid gap-4 rounded-2xl border border-[#E9E2F3] bg-[#F8F4FF] p-4" key={index}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-black text-[#7C3AED]">Criterion {index + 1}</p>
              <button
                aria-label={`Remove success criterion ${index + 1}`}
                className="grid h-9 w-9 place-items-center rounded-xl border border-[#E9E2F3] bg-white text-[#6F657C] transition hover:border-[#DC2626]/30 hover:text-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/70 disabled:opacity-50"
                disabled={criteria.length <= 1}
                onClick={() => removeItem(index)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>
            <Input
              label="Criteria title"
              onChange={(event) => updateItem(index, { title: event.target.value })}
              placeholder="Each lead includes name, phone, city, motivation, and status."
              value={item.title}
            />
            <Textarea
              label="Description"
              onChange={(event) => updateItem(index, { description: event.target.value })}
              placeholder="Explain the evidence or acceptance rule in plain language."
              rows={3}
              value={item.description}
            />
            <Checkbox
              checked={item.required !== false}
              label="Required for completion"
              onChange={(event) => updateItem(index, { required: event.target.checked })}
            />
          </div>
        ))}
      </div>
      <Button className="w-full sm:w-fit" onClick={addItem} type="button" variant="outline">
        <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
        Add criterion
      </Button>
    </section>
  );
}
