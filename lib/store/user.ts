import { create } from "zustand";

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
}

interface UserStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
}));
