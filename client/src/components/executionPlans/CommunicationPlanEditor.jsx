import { PLAN_UPDATE_FREQUENCY_OPTIONS } from "../../features/executionPlans/executionPlanUtils.js";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";

export function CommunicationPlanEditor({ value, onChange }) {
  function setField(field, nextValue) {
    onChange({
      ...value,
      [field]: nextValue,
    });
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Update frequency"
          onChange={(event) => setField("updateFrequency", event.target.value)}
          options={PLAN_UPDATE_FREQUENCY_OPTIONS}
          placeholder=""
          value={value.updateFrequency}
        />
        <Input
          helperText="Separate channels with commas."
          label="Channels"
          onChange={(event) => setField("channelsText", event.target.value)}
          placeholder="Dashboard updates, email"
          value={value.channelsText}
        />
      </div>
      <Textarea
        label="Communication note"
        onChange={(event) => setField("note", event.target.value)}
        placeholder="Explain what the client can expect during execution."
        rows={3}
        value={value.note}
      />
    </div>
  );
}
