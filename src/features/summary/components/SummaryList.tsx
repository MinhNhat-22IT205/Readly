import React from "react";
import { ScrollView } from "react-native";
import { SummaryCardItem, Book } from "./SummaryCardItem";

export const SummaryList = ({
  books,
  onBookPress,
}: {
  books: Book[];
  onBookPress: (book: Book) => void;
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="px-4"
  >
    {books.map((b) => (
      <SummaryCardItem key={b.id} book={b} onPress={() => onBookPress(b)} />
    ))}
  </ScrollView>
);
