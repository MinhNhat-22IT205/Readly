import { EndUser } from "@shared-types/enduser.type";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
interface AuthStore {
  endUser: EndUser;
  setEndUser: (endUser: EndUser) => void;
}

const useAuthStore = create<AuthStore>()(
  devtools((set) => ({
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
  })),
);

export { useAuthStore };