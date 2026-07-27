// Convert a JPEG/PNG to WebP with cwebp.
//
// In your own project, import from the package:
//   import webp from 'webp-converter';
// Here we import from the local build so the example runs inside this repo.
import webp from '../dist/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

// On Linux/macOS, make the bundled binaries executable once.
webp.grant_permission();

try {
  const input = path.join(root, 'nodejs_logo.jpg');
  const output = path.join(out, 'nodejs_logo.webp');

  // cwebp(input, output, option, logging?) — option is a cwebp flag string.
  await webp.cwebp(input, output, '-q 80');

  console.log('✓ wrote', output);
} catch (err) {
  console.error('✗ conversion failed:', err.message);
  process.exitCode = 1;
}
