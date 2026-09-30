import { formatLabel } from '@/lib/functions/label.lib';
import { ROUTES } from '@/navigation/sidebar/routes';
import packageJson from '../../package.json';

const projectName = formatLabel(packageJson.name);

export const projectConfig = {
  logo: './Logo.svg',
  name: projectName,
  domain: packageJson.name,
  version: packageJson.version,
  url: new URL(ROUTES['ui-url']),
};
