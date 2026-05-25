import { useEffect, useRef, useState } from "react";
import {
  Copy,
  Eye,
  Flag,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Settings,
  Share2,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";

const noop = () => {};

const ownerMenuItems = [
  { icon: Eye, key: "viewAsPublic", label: "View as public" },
  { icon: Copy, key: "copyProfileLink", label: "Copy profile link" },
  { icon: Settings, key: "profileSettings", label: "Profile settings" },
];

const publicMenuItems = [
  { icon: Copy, key: "copyProfileLink", label: "Copy profile link" },
  { icon: Share2, key: "shareProfile", label: "Share profile" },
  { icon: Flag, key: "reportProfile", label: "Report profile" },
];

function ActionButton({
  children,
  className = "",
  icon: Icon,
  onClick = noop,
  variant = "secondary",
}) {
  return (
    <Button
      as="button"
      className={`min-h-11 w-full px-4 py-2.5 sm:w-auto ${className}`}
      onClick={onClick}
      type="button"
      variant={variant}
    >
      {Icon ? <Icon aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" /> : null}
      {children}
    </Button>
  );
}

function MoreMenu({ isOwner, onMore = noop }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const items = isOwner ? ownerMenuItems : publicMenuItems;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function handleMenuItemClick(key) {
    onMore(key);
    setIsOpen(false);
  }

  return (
    <div className="relative w-full sm:w-auto" ref={menuRef}>
      <Button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={isOwner ? "Open owner profile menu" : "Open public profile menu"}
        as="button"
        className="min-h-11 w-full px-4 py-2.5 sm:w-auto"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
        variant="outline"
      >
        <MoreHorizontal aria-hidden="true" className="mr-2 h-4 w-4 shrink-0" />
        More
      </Button>

      {isOpen ? (
        <div
          className="absolute right-0 top-[calc(100%+0.5rem)] z-30 w-full min-w-56 rounded-2xl border border-[#E7E5E4] bg-white p-2 shadow-[0_24px_70px_rgba(28, 25, 23, 0.14)] sm:w-64"
          role="menu"
        >
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold text-[#44403C] transition hover:bg-[#F7FEE7] hover:text-[#365314] focus:outline-none focus:ring-2 focus:ring-[#65A30D]/70"
                key={item.key}
                onClick={() => handleMenuItemClick(item.key)}
                role="menuitem"
                type="button"
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ProfileActions({
  connectLabel = "Connect",
  followLabel = "Follow",
  isOwner = false,
  onAddSection = noop,
  onConnect = noop,
  onEnhanceProfile = noop,
  onFollow = noop,
  onMessage = noop,
  onMore = noop,
  onOpenTo = noop,
}) {
  if (isOwner) {
    return (
      <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap">
        <ActionButton icon={Send} onClick={onOpenTo} variant="primary">
          Open to
        </ActionButton>
        <ActionButton icon={Plus} onClick={onAddSection}>
          Add section
        </ActionButton>
        <ActionButton icon={Sparkles} onClick={onEnhanceProfile} variant="outline">
          Enhance profile
        </ActionButton>
        <MoreMenu isOwner onMore={onMore} />
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:flex-wrap">
      <ActionButton icon={UserPlus} onClick={onConnect} variant="primary">
        {connectLabel}
      </ActionButton>
      <ActionButton icon={MessageCircle} onClick={onMessage}>
        Message
      </ActionButton>
      <ActionButton icon={Plus} onClick={onFollow} variant="outline">
        {followLabel}
      </ActionButton>
      <MoreMenu onMore={onMore} />
    </div>
  );
}
