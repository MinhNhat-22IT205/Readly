import { EndUserMinimal } from "./enduser.type";
import { Summary } from "./summary.type";

type Comment = {
  _id: string;
  summary: Summary;
  endUser: EndUserMinimal;
  content: string;
  parent_comment_id?: string;
  access: "public" | "private";
  createdAt: Date;
};

export { Comment };
