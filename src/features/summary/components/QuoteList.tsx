import React from "react";
import { ScrollView } from "react-native";
import { QuoteCardItem, Quote } from "./QuoteCardItem";

export const QuoteList = ({ quotes }: { quotes: Quote[] }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerClassName="px-4 mt-4"
  >
    {quotes.map((q) => (
      <QuoteCardItem key={q.id} quote={q} />
    ))}
  </ScrollView>
);

