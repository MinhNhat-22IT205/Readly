type EndUser = {
  id: string;
  username: string;
  email: string;
  profile_image: string;
  bio: string;
  phone: string;
  is_active: boolean;
  role: "reader" | "writer" | "admin";
};

type EndUserMinimal = Pick<EndUser, "id" | "username" | "profile_image">;

export { EndUser, EndUserMinimal };
