export const formatLabel = (value: string) => {
  if (!value) return '';

  // Handle boolean strings
  const lower = value?.toLowerCase();
  if (lower === 'true') return 'True';
  if (lower === 'false') return 'False';

  // Replace dots, underscores, hyphens, and camelCase with spaces
  return value
    .replace(/\./g, ' ') // handle dot paths like address.geo_address
    .replace(/([a-z])([A-Z])/g, '$1 $2') // handle camelCase
    .replace(/[-_]/g, ' ') // handle snake_case, kebab-case
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getInitials = (name?: string, maxChars = 2): string => {
  if (!name) return 'A';
  const clean = name.trim();
  if (!clean) return 'A';

  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, maxChars).toUpperCase();
  }

  return words
    .slice(0, maxChars)
    .map(word => word[0].toUpperCase())
    .join('');
};