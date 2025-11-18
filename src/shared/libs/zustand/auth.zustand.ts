import { create } from "zustand";
// import { devtools } from "zustand/middleware"; // <-- Remove this
import { EndUser } from "../../types/enduser.type";

interface AuthStore {
  endUser: EndUser;
  access_token: string;
  setToken: (token: string) => void;
  setEndUser: (endUser: EndUser) => void;
}
const initialEndUser: EndUser = {
  id: "",
  username: "",
  email: "",
  phone: "",
  is_active: false,
  role: "reader",
};

// Wrap the store logic directly in create()
const useAuthStore = create<AuthStore>()((set) => ({
  endUser: initialEndUser,
  access_token: "",
  setToken: (access_token) => set({ access_token }),
  setEndUser: (endUser) => set({ endUser }),
  clearAuth: () =>
    set({
      endUser: initialEndUser,
      access_token: "",
    }),
}));

export { useAuthStore };
