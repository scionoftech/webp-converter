// Convert a WebP back to another format (PNG/JPEG) with dwebp.
import webp from '../dist/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

webp.grant_permission();

try {
  // First make a WebP to decode.
  const webpFile = path.join(out, 'roundtrip.webp');
  await webp.cwebp(path.join(root, 'nodejs_logo.jpg'), webpFile, '-q 80');

  // dwebp(input, output, option, logging?) — '-o' writes a PNG by default.
  const pngFile = path.join(out, 'roundtrip.png');
  await webp.dwebp(webpFile, pngFile, '-o');

  console.log('✓ decoded', webpFile, '→', pngFile);
} catch (err) {
  console.error('✗ decode failed:', err.message);
  process.exitCode = 1;
}
