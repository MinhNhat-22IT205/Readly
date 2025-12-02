/**
 * Validates and sanitizes image URI to prevent parsing errors
 * @param uri - The URI to validate
 * @param fallback - Fallback URI if the provided URI is invalid
 * @returns A valid URI string
 */
export const validateImageUri = (
  uri: string | null | undefined,
  fallback: string = "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop"
): string => {
  // Return fallback if uri is null, undefined, or empty string
  if (!uri || typeof uri !== "string" || uri.trim() === "") {
    return fallback;
  }

  // Check if URI starts with http:// or https://
  const trimmedUri = uri.trim();
  if (!trimmedUri.startsWith("http://") && !trimmedUri.startsWith("https://")) {
    return fallback;
  }

  // Basic validation: check if it's a valid URL format
  try {
    new URL(trimmedUri);
    return trimmedUri;
  } catch {
    return fallback;
  }
};

