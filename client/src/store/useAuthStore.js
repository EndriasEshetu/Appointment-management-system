import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const customStorage = {
  getItem: (name) => {
    const local = localStorage.getItem(name);
    if (local) return local;
    return sessionStorage.getItem(name);
  },
  setItem: (name, value) => {
    const parsed = JSON.parse(value);
    // If rememberMe is true, use localStorage, otherwise use sessionStorage
    if (parsed.state.rememberMe) {
      localStorage.setItem(name, value);
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.setItem(name, value);
      localStorage.removeItem(name);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  },
};

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      rememberMe: false,
      setCredentials: (user, token, rememberMe = false) =>
        set({ user, token, rememberMe }),
      logout: () => {
        set({ user: null, token: null, rememberMe: false });
        // Clear both storages on logout
        localStorage.removeItem("auth-storage");
        sessionStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => customStorage),
    }
  )
);

export default useAuthStore;
