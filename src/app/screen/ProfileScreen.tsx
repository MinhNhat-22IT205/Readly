import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";
import { updateProfile } from "@features/profile/api/profile.api";
import { isServerError } from "@shared-utils/is-server-error";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { BASE_API_URL } from "@shared-constants/base-api-path";
import { validateImageUri } from "@shared-utils/validate-image-uri";

const DUMMY_AVATAR =
  "https://velle.vn/wp-content/uploads/2025/04/avatar-mac-dinh-4-2.jpg";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const endUser = useAuthStore((s) => s.endUser);
  const setEndUser = useAuthStore((s) => s.setEndUser);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  // For web: store the File object
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    username: endUser.username || "",
    email: endUser.email || "",
    phone: endUser.phone || "",
    bio: endUser.bio || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      console.log("💾 Saving profile:", {
        hasImage: !!selectedImageUri || !!selectedImageFile,
        imageUri: selectedImageUri?.substring(0, 50) + "...",
        hasFile: !!selectedImageFile,
        platform: Platform.OS,
      });

      const result = await updateProfile(
        formData,
        selectedImageUri || undefined,
        selectedImageFile || undefined
      );

      if (isServerError(result)) {
        console.error("❌ Profile update failed:", result);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: result.message || "Failed to update profile",
        });
        return;
      }

      console.log("✅ Profile updated:", {
        profile_image: result.profile_image,
      });

      setEndUser(result);
      // Cleanup blob URL before clearing state
      if (selectedImageUri && selectedImageUri.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImageUri);
      }
      setSelectedImageUri(null);
      setSelectedImageFile(null);
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("❌ Profile save error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.message || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: endUser.username || "",
      email: endUser.email || "",
      phone: endUser.phone || "",
      bio: endUser.bio || "",
    });
    // Cleanup blob URL before clearing state
    if (selectedImageUri && selectedImageUri.startsWith("blob:")) {
      URL.revokeObjectURL(selectedImageUri);
    }
    setSelectedImageUri(null);
    setSelectedImageFile(null);
    setIsEditing(false);
  };

  const pickImage = async () => {
    try {
      // Web platform: use file input
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.style.display = "none";

        input.onchange = (e: Event) => {
          const target = e.target as HTMLInputElement;
          const file = target.files?.[0];
          if (file) {
            console.log("📸 Image selected (web):", {
              name: file.name,
              size: file.size,
              type: file.type,
            });

            // Create blob URL for preview
            const blobUrl = URL.createObjectURL(file);
            setSelectedImageUri(blobUrl);
            setSelectedImageFile(file);
          }
        };

        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
        return;
      }

      // Mobile platform: use expo-image-picker
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "We need access to your photos to set a profile picture."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("📸 Image selected (mobile):", {
          uri: result.assets[0].uri.substring(0, 50) + "...",
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
        setSelectedImageUri(result.assets[0].uri);
        setSelectedImageFile(null); // Mobile doesn't use File object
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to pick image",
      });
    }
  };

  // Determine avatar URI to display
  const getAvatarUri = () => {
    // Priority 1: Selected image (from picker)
    if (selectedImageUri) {
      // For blob URLs (web), use directly
      if (selectedImageUri.startsWith("blob:")) {
        return selectedImageUri;
      }
      // For local file URIs (mobile), use directly without validation
      if (
        selectedImageUri.startsWith("file://") ||
        selectedImageUri.startsWith("content://")
      ) {
        return selectedImageUri;
      }
      // For other URIs, validate
      return validateImageUri(selectedImageUri, DUMMY_AVATAR);
    }
    // Priority 2: User's profile image from backend (relative path)
    if (endUser.profile_image) {
      // Build full URL from relative path
      const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "";
      if (baseUrl) {
        const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
        const cleanPath = endUser.profile_image.startsWith("/") 
          ? endUser.profile_image 
          : "/" + endUser.profile_image;
        return cleanBaseUrl + cleanPath;
      }
    }
    // Priority 3: Default avatar
    return DUMMY_AVATAR;
  };

  const avatarUri = getAvatarUri();

  // Cleanup blob URLs when component unmounts or when saving/canceling
  useEffect(() => {
    return () => {
      // Cleanup blob URL when component unmounts
      if (selectedImageUri && selectedImageUri.startsWith("blob:")) {
        URL.revokeObjectURL(selectedImageUri);
      }
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-neutral-900">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 -ml-2"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-white">Profile</Text>
        {isEditing ? (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={handleCancel}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              <Text className="text-gray-400 text-base">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#b0e7b7" />
              ) : (
                <Text className="text-[#b0e7b7] text-base font-semibold">
                  Save
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={24} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Avatar Section */}
        <View className="items-center py-8">
          <View className="relative">
            <Image
              source={{ uri: avatarUri }}
              className="w-32 h-32 rounded-full"
              resizeMode="cover"
              key={selectedImageUri || endUser.profile_image || "default"}
              onError={(e) => {
                console.error("Image load error:", e.nativeEvent.error);
              }}
            />
            {isEditing && (
              <TouchableOpacity
                onPress={pickImage}
                className="absolute bottom-0 right-0 bg-[#b0e7b7] rounded-full p-2"
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <Text className="text-white text-xl font-semibold mt-4">
            {endUser.username || "User"}
          </Text>
          <Text className="text-gray-400 text-sm mt-1">
            {endUser.role?.toUpperCase() || "READER"}
          </Text>
        </View>

        {/* User Info Section */}
        <View className="px-4">
          {/* Username */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-2">Username</Text>
            {isEditing ? (
              <TextInput
                value={formData.username}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, username: text }))
                }
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                placeholderTextColor="#666"
                placeholder="Enter username"
              />
            ) : (
              <View className="bg-gray-800 px-4 py-3 rounded-lg">
                <Text className="text-white text-base">
                  {endUser.username || "Not set"}
                </Text>
              </View>
            )}
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-2">Email</Text>
            {isEditing ? (
              <TextInput
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                placeholderTextColor="#666"
                placeholder="Enter email"
              />
            ) : (
              <View className="bg-gray-800 px-4 py-3 rounded-lg">
                <Text className="text-white text-base">
                  {endUser.email || "Not set"}
                </Text>
              </View>
            )}
          </View>

          {/* Phone */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-2">Phone</Text>
            {isEditing ? (
              <TextInput
                value={formData.phone}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
                keyboardType="phone-pad"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700"
                placeholderTextColor="#666"
                placeholder="Enter phone number"
              />
            ) : (
              <View className="bg-gray-800 px-4 py-3 rounded-lg">
                <Text className="text-white text-base">
                  {endUser.phone || "Not set"}
                </Text>
              </View>
            )}
          </View>

          {/* Bio */}
          <View className="mb-6">
            <Text className="text-gray-400 text-sm mb-2">Bio</Text>
            {isEditing ? (
              <TextInput
                value={formData.bio}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, bio: text }))
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 min-h-[100px]"
                placeholderTextColor="#666"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <View className="bg-gray-800 px-4 py-3 rounded-lg min-h-[60px]">
                <Text className="text-white text-base">
                  {endUser.bio || "No bio yet"}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
