import { create } from "zustand";

const useAuth = create((set) => ({
  user: null,
  loading: true,
  serverError: false,
  login: (user) => set({ user, loading: false }),
  logout: () => set({ user: null, loading: false }),
  setLoading: (loading) => set({ loading }),
  setServerError: (serverError) => set({ serverError }),
}));

export { useAuth };
