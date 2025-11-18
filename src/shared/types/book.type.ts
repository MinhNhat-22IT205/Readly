import { Author } from "./author.type";
import { Category } from "./catagory.type";
import { Publisher } from "./publisher.type";

type Book = {
  id: number;
  category_id: number;
  author_id: number;
  publisher_id: number;
  title: string;
  publish_date: string;
  cover_image: string;
  price: number;
  stock_quantity: number;
};
type BookPopulated = Book & {
  category: Category;
  author: Author;
  publisher: Publisher;
};

export type { Book, BookPopulated };
