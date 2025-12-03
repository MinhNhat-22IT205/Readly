/**
 * Builds full URL for book cover image
 * Handles both absolute URLs and relative paths
 * @param coverImage - The cover image path from backend (can be full URL or relative path)
 * @returns Full URL string or null
 */
export const buildBookCoverUrl = (
  coverImage: string | null | undefined
): string | null => {
  if (!coverImage) return null;

  // If it's already a full URL (http/https), return as is
  if (coverImage.startsWith("http://") || coverImage.startsWith("https://")) {
    return coverImage;
  }

  // If it's a relative path (starts with /), prepend base URL
  if (coverImage.startsWith("/")) {
    const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "";
    return baseUrl + coverImage;
  }

  // Otherwise, assume it's a relative path and prepend base URL with /
  const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || "";
  return baseUrl + "/" + coverImage;
};

