export type UserRole = {
  id: string;
  role_name: "reader" | "writer" | "admin";
  permissions: any;
};
