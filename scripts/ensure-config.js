import { copyFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sample = join(root, 'config.json.sample');
const target = join(root, 'config.json');

if (!existsSync(target) && existsSync(sample)) {
  copyFileSync(sample, target);
  console.log('Created config.json from config.json.sample');
}
