import { useCallback, useMemo, useState } from "react";
import { ToastContext } from "../hooks/useToast.js";

const toneClasses = {
  error: "border-[#3F6212]/30 bg-[#F7FEE7] text-[#365314]",
  success: "border-[#3F6212]/25 bg-[#3F6212] text-white",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((toastId) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== toastId),
    );
  }, []);

  const showToast = useCallback(
    ({ message, type = "success" }) => {
      const toastId = crypto.randomUUID();

      setToasts((currentToasts) => [
        ...currentToasts,
        {
          id: toastId,
          message,
          type,
        },
      ]);

      window.setTimeout(() => removeToast(toastId), 4500);
    },
    [removeToast],
  );

  const contextValue = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <div className="fixed right-4 top-4 z-[100] grid w-[calc(100vw-2rem)] max-w-sm gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-2xl border px-4 py-3 text-sm shadow-[0_24px_70px_rgba(17,17,17,0.14)] backdrop-blur-xl ${toneClasses[toast.type] ?? toneClasses.success}`}
            role="status"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="leading-6">{toast.message}</p>
              <button
                aria-label="Dismiss notification"
                className="rounded-full px-2 text-lg leading-none transition hover:bg-black/5"
                onClick={() => removeToast(toast.id)}
                type="button"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
