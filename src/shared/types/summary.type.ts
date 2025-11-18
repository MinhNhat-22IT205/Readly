import { BookPopulated } from "./book.type";
import { ContentSection } from "./content_section.type";
import { EndUser, EndUserMinimal } from "./enduser.type";

type Summary = {
  id: string;
  title: string;
  book_id: string;
  published_date: Date;
  user_id: string;
  status: "writing" | "waiting_for_approval" | "approved" | "rejected";
  read_count: number;
  audio_url: string;
  avg_rating: number;
  created_at: Date;
};

type SummaryPopulated = Summary & {
  book: BookPopulated;
  user: EndUser;
};
export type { Summary, SummaryPopulated };
