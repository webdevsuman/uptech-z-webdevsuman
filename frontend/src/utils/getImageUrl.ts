/**
 * Resolves course image / thumbnail paths into a full URL.
 * Handles absolute URLs, Cloudinary URLs, relative server paths, and provides a fallback.
 */
export function getImageUrl(
  imagePath?: string | { url?: string } | null
): string {
  let pathStr = "";
  if (typeof imagePath === "string") {
    pathStr = imagePath;
  } else if (imagePath && typeof imagePath === "object" && imagePath.url) {
    pathStr = imagePath.url;
  }

  if (!pathStr || pathStr.trim() === "") {
    return "/images/placeholder-course.jpg";
  }

  const cleanPath = pathStr.trim();

  // Already a full URL or data URI
  if (
    cleanPath.startsWith("http://") ||
    cleanPath.startsWith("https://") ||
    cleanPath.startsWith("data:")
  ) {
    return cleanPath;
  }

  // Relative path from backend
  const backendOrigin =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/api\/?$/, "") ||
    "http://localhost:5000";

  return cleanPath.startsWith("/")
    ? `${backendOrigin}${cleanPath}`
    : `${backendOrigin}/${cleanPath}`;
}
