import { formatLabel } from '@/utils/functions/label.lib';
import packageJson from '../../package.json';

const projectName = formatLabel(packageJson.name);

export const projectConfig = {
  logo: '/Logo.svg',
  name: projectName,
  domain: packageJson.name,
  version: packageJson.version,
  description: packageJson.description,
};
