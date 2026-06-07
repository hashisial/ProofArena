import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { getRealtimeBaseUrl } from "../../services/apiClient.js";
import { cn } from "../../utils/index.js";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxCoverSize = 6 * 1024 * 1024;

function getMediaUrl(value) {
  const source = typeof value === "string" ? value : value?.url ?? "";

  if (!source) {
    return "";
  }

  return source.startsWith("/uploads/") ? `${getRealtimeBaseUrl()}${source}` : source;
}

function getValidationError(file) {
  if (!file) {
    return "";
  }

  if (!allowedTypes.has(file.type)) {
    return "Please upload a JPG, PNG, or WebP image.";
  }

  if (file.size > maxCoverSize) {
    return "Cover photo must be under 6MB.";
  }

  return "";
}

export function CoverPhotoModal({
  currentCover,
  isUploading = false,
  onClose,
  onUpload,
  open = false,
}) {
  const inputId = useId();
  const previewUrlRef = useRef("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const currentCoverUrl = getMediaUrl(currentCover);

  function clearPreview() {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }
  }

  function resetSelection() {
    clearPreview();
    setError("");
    setPreviewUrl("");
    setSelectedFile(null);
  }

  useEffect(
    () => () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = "";
      }
    },
    [],
  );

  function handleClose() {
    if (isUploading) {
      return;
    }

    resetSelection();
    onClose?.();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0] ?? null;
    clearPreview();
    setSelectedFile(null);
    setPreviewUrl("");

    const validationError = getValidationError(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!file) {
      setError("");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    previewUrlRef.current = nextPreviewUrl;
    setError("");
    setPreviewUrl(nextPreviewUrl);
    setSelectedFile(file);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = getValidationError(selectedFile);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!selectedFile) {
      setError("Choose a cover photo before saving.");
      return;
    }

    try {
      setError("");
      await onUpload?.(selectedFile);
      resetSelection();
      onClose?.();
    } catch {
      setError("Upload failed. Please try again.");
    }
  }

  return (
    <Modal
      description="Preview and save a new profile cover image for your owner profile."
      footer={
        <>
          <Button disabled={isUploading} onClick={handleClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!selectedFile || Boolean(error)}
            form="cover-photo-upload-form"
            isLoading={isUploading}
            loadingLabel="Saving cover..."
            type="submit"
          >
            Save cover
          </Button>
        </>
      }
      isOpen={open}
      onClose={handleClose}
      size="lg"
      title="Update cover photo"
    >
      <form className="grid gap-5" id="cover-photo-upload-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {error}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-3xl border border-[#EDE9FE] bg-[radial-gradient(circle_at_20%_0%,rgba(167, 139, 250, 0.28),transparent_20rem),linear-gradient(135deg,#FFFFFF_0%,#F5F3FF_44%,#EDE9FE_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          <div className="aspect-[3/1] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#F8F4FF_0%,#EDE9FE_55%,#A78BFA_100%)]">
            {previewUrl || currentCoverUrl ? (
              <img
                alt="Cover photo preview"
                className="h-full w-full object-cover"
                src={previewUrl || currentCoverUrl}
              />
            ) : (
              <div
                aria-hidden="true"
                className="h-full w-full bg-[radial-gradient(circle_at_18%_25%,rgba(255,255,255,0.85),transparent_11rem),radial-gradient(circle_at_82%_18%,rgba(124, 58, 237, 0.24),transparent_15rem),linear-gradient(135deg,#FFFFFF_0%,#EDE9FE_50%,#A78BFA_100%)]"
              />
            )}
          </div>
        </div>

        <label
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-[#A78BFA] bg-[#F5F3FF] px-5 py-6 text-center transition hover:border-[#7C3AED] hover:bg-[#F5F3FF] focus-within:ring-4 focus-within:ring-[#A78BFA]/30",
            isUploading && "pointer-events-none opacity-60",
          )}
          htmlFor={inputId}
        >
          <input
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            disabled={isUploading}
            id={inputId}
            onChange={handleFileChange}
            type="file"
          />
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-[#7C3AED] shadow-[0_16px_40px_rgba(124, 58, 237, 0.16)]">
            {selectedFile ? (
              <ImagePlus aria-hidden="true" className="h-5 w-5" />
            ) : (
              <UploadCloud aria-hidden="true" className="h-5 w-5" />
            )}
          </span>
          <span className="text-sm font-black text-[#07030D]">
            {selectedFile ? selectedFile.name : "Choose cover photo"}
          </span>
          <span className="text-xs font-semibold leading-5 text-[#6F657C]">
            JPG, PNG, or WebP up to 6MB
          </span>
        </label>
      </form>
    </Modal>
  );
}
