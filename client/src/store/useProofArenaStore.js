import { create } from "zustand";

export const PROOF_ARENA_ROLES = Object.freeze(["provider", "client", "admin"]);

export const useProofArenaStore = create((set) => ({
  activeRole: null,
  clearActiveRole: () => set({ activeRole: null }),
  setActiveRole: (activeRole) =>
    set({
      activeRole: PROOF_ARENA_ROLES.includes(activeRole) ? activeRole : null,
    }),
}));

