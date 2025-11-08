import { EndUserMinimal } from "./enduser.type";

type Summary = {
  _id: string;
  title: string;
  book_athor: string;
  book_cover_path: string;
  published_date: Date;
  category_id: string;
  user: EndUserMinimal;
  status: "writing" | "waiting_for_approval" | "approved" | "rejected";
  read_count: number;
  content: SummarySection[];
  createdAt: Date;
  updatedAt: Date;
};
type SummarySection = {
  section_order: number;
  title: string;
  content: string;
};

export { Summary, SummarySection };
