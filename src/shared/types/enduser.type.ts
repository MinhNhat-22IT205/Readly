import { UserRole } from "./user-role.type";

type EndUser = {
  id: string;
  username: string;
  email: string;
  profile_image: string;
  bio: string;
  phone: string;
  is_active: boolean;
  role: "reader" | "writer" | "admin";
  role_id?: number; // Optional: role_id from backend (1=admin, 2=reader, 3=writer)
};

type EndUserMinimal = Pick<EndUser, "id" | "username" | "profile_image">;

type EndUserPopulated = Omit<EndUser, "role"> & {
  role: UserRole;
};

export { EndUser, EndUserMinimal, EndUserPopulated };
