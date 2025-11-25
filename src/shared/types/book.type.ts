import { Author } from "./author.type";
import { Category } from "./catagory.type";
import { Publisher } from "./publisher.type";

type Book = {
  id: number;
  category_id: number | null;
  author_id: number | null;
  publisher_id: number | null;
  title: string;
  publish_date: string | null;
  cover_image: string | null;
  price: number;
  stock_quantity: number;
};
type BookPopulated = Book & {
  category?: Category | null;
  author?: Author | null;
  publisher?: Publisher | null;
};

export type { Book, BookPopulated };
