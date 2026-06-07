import { useState } from "react";
import {
  PROOF_ASSET_TYPE_OPTIONS,
  PROOF_SOURCE_TYPE_OPTIONS,
  PROOF_VISIBILITY_OPTIONS,
  createInitialProofAssetForm,
  proofAssetToForm,
  validateProofAssetForm,
} from "../../features/proofAssets/proofAssetUtils.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { Select } from "../ui/Select.jsx";
import { Textarea } from "../ui/Textarea.jsx";
import { ProofAssetUploadBox } from "./ProofAssetUploadBox.jsx";

export function ProofAssetForm({
  asset,
  error = "",
  isSubmitting = false,
  onCancel,
  onSubmit,
}) {
  const [form, setForm] = useState(() => asset ? proofAssetToForm(asset) : createInitialProofAssetForm());
  const [errors, setErrors] = useState({});

  function setField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function setNested(group, field, value) {
    setForm((current) => ({
      ...current,
      [group]: {
        ...current[group],
        [field]: value,
      },
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProofAssetForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit?.(form);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {error ? (
        <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEE2E2] p-4 text-sm font-bold leading-6 text-[#991B1B]">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4">
        <h3 className="text-lg font-black text-[#07030D]">Basic info</h3>
        <Input
          error={errors.title}
          label="Title"
          onChange={(event) => setField("title", event.target.value)}
          placeholder="CRM cleanup report for real estate leads"
          required
          value={form.title}
        />
        <Textarea
          label="Description"
          onChange={(event) => setField("description", event.target.value)}
          placeholder="Describe what this proof asset shows and when to use it."
          rows={4}
          value={form.description}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            error={errors.assetType}
            label="Asset type"
            onChange={(event) => setField("assetType", event.target.value)}
            options={PROOF_ASSET_TYPE_OPTIONS}
            placeholder=""
            required
            value={form.assetType}
          />
          <Input
            label="Category"
            onChange={(event) => setField("category", event.target.value)}
            placeholder="Lead Generation"
            value={form.category}
          />
        </div>
      </section>

      <section className="grid gap-4">
        <h3 className="text-lg font-black text-[#07030D]">Source</h3>
        <Select
          error={errors.sourceType}
          label="Source type"
          onChange={(event) => setField("sourceType", event.target.value)}
          options={PROOF_SOURCE_TYPE_OPTIONS}
          placeholder=""
          required
          value={form.sourceType}
        />
        {form.sourceType === "file" ? <ProofAssetUploadBox /> : null}
        {form.sourceType === "link" ? (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_16rem]">
            <Input
              error={errors.linkUrl}
              label="Proof URL"
              onChange={(event) => setNested("link", "url", event.target.value)}
              placeholder="https://example.com/report"
              required
              value={form.link.url}
            />
            <Input
              label="Link label"
              onChange={(event) => setNested("link", "label", event.target.value)}
              placeholder="Weekly CRM report"
              value={form.link.label}
            />
          </div>
        ) : null}
        {form.sourceType === "text" ? (
          <Textarea
            error={errors.textContent}
            label="Text proof content"
            onChange={(event) => setNested("textProof", "content", event.target.value)}
            placeholder="Paste proof notes, report summary, or reusable work sample details."
            required
            rows={7}
            value={form.textProof.content}
          />
        ) : null}
        {errors.file ? (
          <p className="text-sm font-bold text-[#6D28D9]">{errors.file}</p>
        ) : null}
      </section>

      <section className="grid gap-4">
        <h3 className="text-lg font-black text-[#07030D]">Tags and relation</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Related skills" onChange={(event) => setField("relatedSkillsText", event.target.value)} placeholder="CRM, Lead Cleaning" value={form.relatedSkillsText} />
          <Input label="Related tools" onChange={(event) => setField("relatedToolsText", event.target.value)} placeholder="HubSpot, Google Sheets" value={form.relatedToolsText} />
          <Input label="Related industries" onChange={(event) => setField("relatedIndustriesText", event.target.value)} placeholder="Real Estate, SaaS" value={form.relatedIndustriesText} />
          <Input label="Tags" onChange={(event) => setField("tagsText", event.target.value)} placeholder="crm, weekly report, proof" value={form.tagsText} />
        </div>
      </section>

      <section className="grid gap-4">
        <h3 className="text-lg font-black text-[#07030D]">Visibility</h3>
        <Select
          label="Visibility"
          onChange={(event) => setField("visibility", event.target.value)}
          options={PROOF_VISIBILITY_OPTIONS}
          placeholder=""
          value={form.visibility}
        />
      </section>

      <div className="flex flex-col gap-3 border-t border-[#E9E2F3] pt-5 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} type="button" variant="secondary">
          Cancel
        </Button>
        <Button isLoading={isSubmitting} loadingLabel="Saving..." type="submit">
          Save Proof Asset
        </Button>
      </div>
    </form>
  );
}
