import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ThreeDotMenuButtonProps {
  onPress: () => void;
  color?: string;
  size?: number;
}

export const ThreeDotMenuButton: React.FC<ThreeDotMenuButtonProps> = ({
  onPress,
  color = "#fff",
  size = 24,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-10 h-10 items-center justify-center"
      activeOpacity={0.7}
    >
      <Ionicons name="ellipsis-horizontal" size={size} color={color} />
    </TouchableOpacity>
  );
};

