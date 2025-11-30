import React from "react";
import { ScrollView, View, Text } from "react-native";
import { FavouriteItem } from "./FavouriteItem";
import { PopulatedFavourite } from "@shared-types/favourite.type";
import { Ionicons } from "@expo/vector-icons";

export const FavouriteList = ({
  favourites,
  onFavouritePress,
}: {
  favourites: PopulatedFavourite[];
  onFavouritePress: (favourite: PopulatedFavourite) => void;
}) => {
  if (favourites.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <Ionicons name="heart-outline" size={64} color="#666" />
        <Text className="text-gray-400 text-lg mt-4">No favourites yet</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {favourites.map((favourite) => (
        <FavouriteItem
          key={favourite.id}
          favourite={favourite}
          onPress={() => onFavouritePress(favourite)}
        />
      ))}
    </ScrollView>
  );
};

