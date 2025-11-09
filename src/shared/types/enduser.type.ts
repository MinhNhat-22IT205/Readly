type EndUser = {
  _id: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  role?: "reader" | "writer" | "admin";
  createdAt: string;
  updatedAt: string;
};

type EndUserMinimal = Pick<EndUser, "_id" | "username" | "avatar">;
type EndUserSearchMinimal = Pick<
  EndUser,
  "_id" | "username" | "avatar" | "bio"
>;
type EndUserProfile = {
  endUser: EndUser;
  isFriend: boolean;
};
type EndUserProfileMinimal = EndUser & {
  isFriend: boolean;
};

export {
  EndUser,
  EndUserMinimal,
  EndUserSearchMinimal,
  EndUserProfile,
  EndUserProfileMinimal,
};
