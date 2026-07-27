// Convert an animated GIF to an animated WebP with gif2webp (gwebp).
import webp from '../dist/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

webp.grant_permission();

try {
  const input = path.join(root, 'linux_logo.gif');
  const output = path.join(out, 'linux_logo.webp');

  // gwebp(input, output, option, logging?)
  await webp.gwebp(input, output, '-q 80');

  console.log('✓ wrote animated', output);
} catch (err) {
  console.error('✗ conversion failed:', err.message);
  process.exitCode = 1;
}
