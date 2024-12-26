import { create } from "zustand";

const useAuthStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem("user")) ?? undefined,
  setCurrentUser: (user) => set({ currentUser: user }),
}));

export default useAuthStore;
