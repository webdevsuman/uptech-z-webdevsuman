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