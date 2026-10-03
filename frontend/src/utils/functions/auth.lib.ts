
/**
 * Normalizes user role input (whether a flat string or a populated object `{ _id, name }`)
 * into a clean UserRole string.
 */
export const getRoleName = (
  role?: string | { name?: string } | null
): string | null => {
  if (!role) return null;
  if (typeof role === "object" && role !== null && "name" in role) {
    return role.name || null;
  }
  if (typeof role === "string") {
    return role;
  }
  return null;
};
