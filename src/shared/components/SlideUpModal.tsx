import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface SlideUpModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showHandleBar?: boolean;
  showCloseButton?: boolean;
  maxHeight?: number;
}

export const SlideUpModal = ({
  visible,
  onClose,
  children,
  title,
  showHandleBar = true,
  showCloseButton = true,
  maxHeight,
}: SlideUpModalProps) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriverForBackdrop
      hideModalContentWhileAnimating
    >
      <View
        style={[styles.container, maxHeight ? { maxHeight } : undefined]}
        className="bg-gray-900 rounded-t-3xl"
      >
        <SafeAreaView edges={["bottom"]} className="flex-1">
          {/* Handle Bar */}
          {showHandleBar && (
            <View className="items-center pt-3 pb-2">
              <View className="w-12 h-1 bg-gray-600 rounded-full" />
            </View>
          )}

          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between px-5 pb-4 border-b border-gray-800">
              {title && (
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">{title}</Text>
                </View>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  className="w-10 h-10 rounded-full bg-gray-800 items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          {children}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
