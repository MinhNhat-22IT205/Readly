type EndUser = {
  id: string;
  username: string;
  email: string;
  phone: string;
  is_active: boolean;
  role: "reader" | "writer" | "admin";
};

type EndUserMinimal = Pick<EndUser, "id" | "username">;

export { EndUser, EndUserMinimal };
