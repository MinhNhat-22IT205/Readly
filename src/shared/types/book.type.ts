import { Author } from "./author.type";
import { Category } from "./catagory.type";
import { Publisher } from "./publisher.type";

type Book = {
  id: number;
  publisher_id: number | null;
  title: string;
  publish_date: string | null;
  cover_image: string | null;
  price: number;
  stock_quantity: number;
};
type BookPopulated = Book & {
  categories?: Category[];
  authors?: Author[];
  publisher?: Publisher | null;
};

export type { Book, BookPopulated };
