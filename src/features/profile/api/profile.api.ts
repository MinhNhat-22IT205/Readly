import { EndUser } from "@shared-types/enduser.type";
import { axiosInstance } from "@shared-libs/axios/axios.base";
import { ServerError } from "@shared-types/server-error.type";
import { useAuthStore } from "@shared-libs/zustand/auth.zustand";

export type UpdateProfileInput = {
  username?: string;
  email?: string;
  phone?: string;
  bio?: string;
};

export const updateProfile = async (
  data: UpdateProfileInput,
  imageUri?: string,
  imageFile?: File
): Promise<EndUser | ServerError> => {
  try {
    const formData = new FormData();
    
    // Add text fields - Backend expects Form fields, not JSON
    // Backend accepts optional fields (Form(None)), but we should only send fields that have values
    // FastAPI will ignore fields that are not sent (None)
    if (data.username !== undefined && data.username !== null && data.username !== "") {
      formData.append("username", data.username);
    }
    if (data.email !== undefined && data.email !== null && data.email !== "") {
      formData.append("email", data.email);
    }
    if (data.phone !== undefined && data.phone !== null && data.phone !== "") {
      formData.append("phone", data.phone);
    }
    if (data.bio !== undefined && data.bio !== null && data.bio !== "") {
      formData.append("bio", data.bio);
    }
    
    // Check if we have at least one field to update
    const hasFields = Object.keys(data).some(
      (key) => data[key as keyof UpdateProfileInput] !== undefined && 
               data[key as keyof UpdateProfileInput] !== null &&
               data[key as keyof UpdateProfileInput] !== ""
    );
    const hasImage = !!imageFile || !!imageUri;
    
    if (!hasFields && !hasImage) {
      console.warn("⚠️ No fields to update");
      return {
        message: "No fields to update",
        statusCode: 400,
        error: "Bad Request",
      };
    }
    
    // Add image file if provided
    // Priority: imageFile (web) > imageUri (mobile)
    if (imageFile) {
      // Web platform: use File object directly
      console.log("📤 Uploading profile image (web):", {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
      });
      
      // Append file with proper field name matching backend: profile_image
      formData.append("profile_image", imageFile);
    } else if (imageUri) {
      // Mobile platform: use URI
      // Extract filename from URI (handle both file:// and content:// URIs)
      let filename = "profile_image.jpg";
      let type = "image/jpeg";
      
      // Try to extract filename from URI
      if (imageUri.includes("/")) {
        const uriParts = imageUri.split("/");
        const lastPart = uriParts[uriParts.length - 1];
        
        // Check if last part has extension
        if (lastPart && lastPart.includes(".")) {
          // Remove query parameters if any (e.g., file://path/image.jpg?timestamp)
          const cleanPart = lastPart.split("?")[0];
          filename = cleanPart;
          const extension = cleanPart.split(".").pop()?.toLowerCase() || "jpg";
          const mimeTypes: Record<string, string> = {
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
          };
          type = mimeTypes[extension] || "image/jpeg";
        } else {
          // Generate filename with timestamp for content:// URIs
          filename = `profile_${Date.now()}.jpg`;
        }
      } else {
        // Generate filename with timestamp
        filename = `profile_${Date.now()}.jpg`;
      }
      
      console.log("📤 Uploading profile image (mobile):", {
        uri: imageUri.substring(0, 50) + "...",
        filename,
        type,
      });
      
      // Create file object for FormData (React Native format)
      // Backend expects UploadFile, which React Native FormData will convert
      const fileObject = {
        uri: imageUri,
        type,
        name: filename,
      };
      
      // Append with field name matching backend: profile_image
      formData.append("profile_image", fileObject as any);
    }
    
    // Get token to verify it exists
    const access_token = useAuthStore.getState().access_token;
    
    // Debug: Log FormData contents (for web only)
    if (typeof FormData !== "undefined" && formData instanceof FormData) {
      console.log("📋 FormData contents:");
      try {
        const entries = (formData as any).entries?.();
        if (entries) {
          for (const [key, value] of entries) {
            if (value instanceof File) {
              console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
            } else {
              console.log(`  ${key}: ${value}`);
            }
          }
        }
      } catch (e) {
        console.log("  (Cannot iterate FormData entries)");
      }
    }
    
    console.log("📤 Sending profile update request:", {
      hasImage: !!imageFile || !!imageUri,
      hasFile: !!imageFile,
      hasUri: !!imageUri,
      fieldsCount: Object.keys(data).filter(
        (key) => data[key as keyof UpdateProfileInput] !== undefined
      ).length,
      hasToken: !!access_token,
      tokenPreview: access_token ? `${access_token.substring(0, 20)}...` : "NO TOKEN",
      formDataKeys: Array.from((formData as any).keys?.() || []),
    });
    
    // Backend endpoint: PATCH /users/me
    // Backend expects multipart/form-data with Form fields
    // NOTE: Don't set Content-Type manually for FormData!
    // Axios will automatically set it with the correct boundary
    // NOTE: Don't set headers here - let the interceptor handle Authorization header
    // Setting headers here might override the interceptor's headers
    const result = await axiosInstance.patch<EndUser>("/users/me", formData);
    
    // Check if response is successful
    if (result.status >= 200 && result.status < 300) {
      console.log("✅ Profile update successful:", {
        profile_image: result.data.profile_image,
        username: result.data.username,
        status: result.status,
      });
      return result.data;
    } else {
      // If status is not 2xx, treat as error
      throw new Error(`Request failed with status ${result.status}`);
    }
  } catch (error: any) {
    console.error("❌ Profile update error:", {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      headers: error?.response?.headers,
      request: error?.request,
    });
    
    // Log full error response for debugging
    if (error?.response?.data) {
      console.error("📋 Full error response:", JSON.stringify(error.response.data, null, 2));
    }
    
    // Backend returns error in format: { detail: "error message" }
    const errorDetail = error?.response?.data?.detail || error?.response?.data?.message;
    
    return (
      error?.response?.data ?? {
        message: errorDetail || error?.message || "Unknown error",
        statusCode: error?.response?.status || 500,
        error: "Unknown",
      }
    );
  }
};

export const getProfile = async (): Promise<EndUser | ServerError> => {
  try {
    const result = await axiosInstance.get<EndUser>("/users/me");
    return result.data;
  } catch (error: any) {
    return (
      error?.response?.data ?? {
        message: error?.message || "Unknown error",
        statusCode: error?.response?.status || 500,
        error: "Unknown",
      }
    );
  }
};

