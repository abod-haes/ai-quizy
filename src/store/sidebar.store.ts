import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  open: boolean;
  openMobile: boolean;
  setOpen: (open: boolean) => void;
  setOpenMobile: (openMobile: boolean) => void;
  toggleOpen: () => void;
  toggleOpenMobile: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      open: true, // Default to open on desktop
      openMobile: false, // Default to closed on mobile (always false, not persisted)
      setOpen: (open) => set({ open }),
      setOpenMobile: (openMobile) => set({ openMobile }),
      toggleOpen: () => set((state) => ({ open: !state.open })),
      toggleOpenMobile: () => set((state) => ({ openMobile: !state.openMobile })),
    }),
    {
      name: "sidebar-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ open: state.open }), // Only persist 'open', not 'openMobile'
    },
  ),
);

