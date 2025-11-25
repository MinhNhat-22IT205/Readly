import { BookPopulated } from "./book.type";
import { ContentSection } from "./content_section.type";
import { EndUser, EndUserMinimal } from "./enduser.type";

type Summary = {
  // Identifiers
  _id?: string;
  id?: string;

  // Basic info
  title: string;
  book_author?: string;
  book_cover_path?: string;

  // Relations
  book_id?: string;
  category_id?: string;
  user: any;
  user_id?: string;

  // Content
  content: Array<{
    section_order: number;
    title: string;
    content: string;
  }>;

  // Meta
  published_date?: Date;
  status: "editing" | "waiting_for_approval" | "approved" | "rejected";
  read_count: number;
  audio_url?: string;
  avg_rating?: number;
  created_at?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

type SummaryPopulated = Summary & {
  book: BookPopulated;
  user: EndUser;
};
export type { Summary, SummaryPopulated };
