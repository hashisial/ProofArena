import { ImagePlus, UploadCloud } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { Button } from "../ui/Button.jsx";
import { Modal } from "../ui/Modal.jsx";
import { getRealtimeBaseUrl } from "../../services/apiClient.js";
import { cn, getInitials } from "../../utils/index.js";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxAvatarSize = 3 * 1024 * 1024;

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

  if (file.size > maxAvatarSize) {
    return "Profile photo must be under 3MB.";
  }

  return "";
}

export function ProfilePhotoModal({
  currentAvatar,
  isUploading = false,
  onClose,
  onUpload,
  open = false,
  userName = "ProofArena Member",
}) {
  const inputId = useId();
  const previewUrlRef = useRef("");
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const currentAvatarUrl = getMediaUrl(currentAvatar);

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
      setError("Choose a profile photo before saving.");
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
      description="Preview and save a new profile photo for your owner profile."
      footer={
        <>
          <Button disabled={isUploading} onClick={handleClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            disabled={!selectedFile || Boolean(error)}
            form="profile-photo-upload-form"
            isLoading={isUploading}
            loadingLabel="Saving photo..."
            type="submit"
          >
            Save photo
          </Button>
        </>
      }
      isOpen={open}
      onClose={handleClose}
      size="md"
      title="Update profile photo"
    >
      <form className="grid gap-5" id="profile-photo-upload-form" onSubmit={handleSubmit}>
        {error ? (
          <div className="rounded-2xl border border-[#DC2626]/20 bg-[#FEF2F2] px-4 py-3 text-sm font-semibold leading-6 text-[#991B1B]">
            {error}
          </div>
        ) : null}

        <div className="grid place-items-center rounded-3xl border border-[#EDE9FE] bg-[radial-gradient(circle_at_50%_0%,rgba(167, 139, 250, 0.2),transparent_18rem),linear-gradient(180deg,#FFFFFF_0%,#F8F4FF_100%)] p-6">
          <div className="grid h-36 w-36 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#F5F3FF] shadow-[0_24px_60px_rgba(31, 14, 54, 0.18)]">
            {previewUrl || currentAvatarUrl ? (
              <img
                alt={`${userName} profile photo preview`}
                className="h-full w-full object-cover"
                src={previewUrl || currentAvatarUrl}
              />
            ) : (
              <span className="text-4xl font-black text-[#5B21B6]">
                {getInitials(userName)}
              </span>
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
            {selectedFile ? selectedFile.name : "Choose profile photo"}
          </span>
          <span className="text-xs font-semibold leading-5 text-[#6F657C]">
            JPG, PNG, or WebP up to 3MB
          </span>
        </label>
      </form>
    </Modal>
  );
}
