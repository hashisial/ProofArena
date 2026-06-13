import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Scale, X } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { MAX_COMPARE_PROVIDERS } from "../../features/providers/providerComparisonState.js";
import { getInitials } from "../../utils/index.js";

function getName(provider = {}) {
  return provider.displayName || provider.fullName || provider.name || provider.username || "Provider";
}

function getAvatar(provider = {}) {
  return provider.avatarUrl || provider.avatar || provider.profilePicture || provider.user?.avatar || "";
}

const MotionDiv = motion.div;

export function ProviderCompareTray({
  onClear,
  onCompare,
  onRemove,
  providers = [],
}) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {providers.length ? (
        <MotionDiv
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-5xl rounded-3xl border border-[#3F6212]/20 bg-white p-3 shadow-[0_24px_80px_rgba(28,25,23,0.18)] sm:p-4 lg:inset-x-auto lg:right-6 lg:w-[min(44rem,calc(100vw-3rem))]"
          exit={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          transition={{ duration: reduceMotion ? 0 : 0.18 }}
        >
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#F7FEE7] text-[#365314]">
                <Scale aria-hidden="true" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-[#3F6212]">
                  Compare providers
                </p>
                <p className="text-sm font-bold text-[#78716C]">
                  {providers.length}/{MAX_COMPARE_PROVIDERS} selected
                </p>
              </div>
              <div className="flex min-w-0 flex-wrap gap-2">
                {providers.map((provider) => {
                  const name = getName(provider);
                  const avatar = getAvatar(provider);

                  return (
                    <span
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#E7E5E4] bg-[#FEFCE8] py-1 pl-1 pr-2"
                      key={provider.userId || provider.id || provider.username}
                    >
                      {avatar ? (
                        <img alt="" className="h-8 w-8 rounded-full object-cover" src={avatar} />
                      ) : (
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#3F6212] text-xs font-black text-white">
                          {getInitials(name)}
                        </span>
                      )}
                      <span className="max-w-[9rem] truncate text-xs font-black text-[#1C1917]">{name}</span>
                      <button
                        aria-label={`Remove ${name} from comparison`}
                        className="grid h-7 w-7 place-items-center rounded-full text-[#78716C] transition hover:bg-white hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                        onClick={() => onRemove?.(provider)}
                        type="button"
                      >
                        <X aria-hidden="true" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={onClear} type="button" variant="outline">
                Clear all
              </Button>
              <Button disabled={providers.length < 2} onClick={onCompare} type="button">
                Compare Now
              </Button>
            </div>
          </div>
        </MotionDiv>
      ) : null}
    </AnimatePresence>
  );
}
