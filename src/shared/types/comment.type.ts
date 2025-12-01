import { EndUserMinimal, EndUserPopulated } from "./enduser.type";
import { Summary } from "./summary.type";

type CommentAccess = "public" | "private";

export type Comment = {
  id: string;
  summary_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  access: CommentAccess;
  created_at: Date;
};

export type CommentPopulated = Comment & {
  user: EndUserPopulated;
  parent_comment?: CommentPopulated | null;
};
