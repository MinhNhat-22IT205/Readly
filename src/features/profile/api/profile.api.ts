import { EndUser } from "@shared-types/enduser.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { ServerError } from "@shared-types/server-error.type";

export type UpdateProfileInput = {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
};

export const updateProfile = async (
  data: UpdateProfileInput,
  imageUri?: string
): Promise<EndUser | ServerError> => {
  try {
    const formData = new FormData();
    
    // Add text fields
    if (data.username !== undefined) {
      formData.append("username", data.username);
    }
    if (data.email !== undefined) {
      formData.append("email", data.email);
    }
    if (data.phone !== undefined) {
      formData.append("phone", data.phone);
    }
    if (data.bio !== undefined) {
      formData.append("bio", data.bio);
    }
    
    // Add image file if provided
    if (imageUri) {
      // Extract filename from URI (handle both file:// and content:// URIs)
      const uriParts = imageUri.split("/");
      const filename = uriParts[uriParts.length - 1] || "image.jpg";
      
      // Determine MIME type from extension
      const extension = filename.split(".").pop()?.toLowerCase() || "jpg";
      const mimeTypes: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        webp: "image/webp",
      };
      const type = mimeTypes[extension] || "image/jpeg";
      
      formData.append("profile_image", {
        uri: imageUri,
        type,
        name: filename,
      } as any);
    }
    
    const result = await axiosInstance.patch<EndUser>("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return result.data;
  } catch (error) {
    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

export const getProfile = async (): Promise<EndUser | ServerError> => {
  try {
    const result = await axiosInstance.get<EndUser>("/users/me");
    return result.data;
  } catch (error) {
    return (
      (error as any).response?.data ?? {
        message: "Unknown error",
        statusCode: 500,
        error: "Unknown",
      }
    );
  }
};

