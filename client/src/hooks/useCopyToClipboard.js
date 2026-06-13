import { useCallback, useEffect, useRef, useState } from "react";

async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is not available");
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();

  const didCopy = document.execCommand("copy");
  document.body.removeChild(textarea);

  if (!didCopy) {
    throw new Error("Unable to copy text");
  }
}

export function useCopyToClipboard(resetAfter = 2000) {
  const [copiedText, setCopiedText] = useState("");
  const [error, setError] = useState(null);
  const resetTimeoutRef = useRef(null);

  const reset = useCallback(() => {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    setCopiedText("");
    setError(null);
  }, []);

  useEffect(
    () => () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    },
    [],
  );

  const copy = useCallback(
    async (value) => {
      const text = String(value ?? "");

      try {
        await copyText(text);
        setCopiedText(text);
        setError(null);

        if (resetAfter > 0 && typeof window !== "undefined") {
          if (resetTimeoutRef.current) {
            window.clearTimeout(resetTimeoutRef.current);
          }

          resetTimeoutRef.current = window.setTimeout(reset, resetAfter);
        }

        return true;
      } catch (copyError) {
        setCopiedText("");
        setError(copyError);
        return false;
      }
    },
    [reset, resetAfter],
  );

  return {
    copiedText,
    copy,
    error,
    isCopied: Boolean(copiedText),
    reset,
  };
}
