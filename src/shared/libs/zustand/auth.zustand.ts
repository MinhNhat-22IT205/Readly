import { create } from "zustand";
// import { devtools } from "zustand/middleware"; // <-- Remove this
import { EndUser } from "../../types/enduser.type";

interface AuthStore {
  endUser: EndUser;
  setEndUser: (endUser: EndUser) => void;
}

// Wrap the store logic directly in create()
const useAuthStore = create<AuthStore>()((set) => ({
  endUser: {
    _id: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
    description: "",
    createdAt: "",
    updatedAt: "",
  },
  setEndUser: (endUser) => set({ endUser }),
}));

export { useAuthStore };