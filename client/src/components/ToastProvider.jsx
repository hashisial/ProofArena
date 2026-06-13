import { useCallback, useEffect, useMemo, useRef } from "react";
import { ToastContext } from "../hooks/useToast.js";
import { useNotificationStore } from "../store/useNotificationStore.js";

const toneClasses = {
  error: "border-[#3F6212]/30 bg-[#F7FEE7] text-[#365314]",
  info: "border-[#3F6212]/20 bg-white text-[#1C1917]",
  success: "border-[#3F6212]/25 bg-[#3F6212] text-white",
  warning: "border-[#A16207]/25 bg-[#FFFBEB] text-[#713F12]",
};

export function ToastProvider({ children }) {
  const timersRef = useRef(new Map());
  const addToast = useNotificationStore((state) => state.addToast);
  const removeToast = useNotificationStore((state) => state.removeToast);
  const toasts = useNotificationStore((state) => state.toasts);

  useEffect(() => {
    const activeToastIds = new Set(toasts.map((toast) => toast.id));

    timersRef.current.forEach((timer, toastId) => {
      if (!activeToastIds.has(toastId)) {
        window.clearTimeout(timer);
        timersRef.current.delete(toastId);
      }
    });

    toasts.forEach((toast) => {
      if (toast.duration > 0 && !timersRef.current.has(toast.id)) {
        const timer = window.setTimeout(() => removeToast(toast.id), toast.duration);
        timersRef.current.set(toast.id, timer);
      }
    });
  }, [removeToast, toasts]);

  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current.clear();
    },
    [],
  );

  const showToast = useCallback((toast) => addToast(toast), [addToast]);

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
