type EndUser = {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role: "reader" | "writer" | "admin";
};

type EndUserMinimal = Pick<EndUser, "user_id" | "username">;

export { EndUser, EndUserMinimal };
