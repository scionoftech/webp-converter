// Manage ICC / XMP / EXIF metadata on a WebP with webpmux.
// The metadata "option" keyword is one of: 'icc', 'xmp', 'exif'.
import webp from '../dist/index.js';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

webp.grant_permission();

try {
  // Start from a plain WebP.
  const base = path.join(out, 'meta-base.webp');
  await webp.cwebp(path.join(root, 'nodejs_logo.jpg'), base, '-q 80');

  // A tiny fake ICC profile payload to attach (any file works for the demo).
  const iccFile = path.join(out, 'demo.icc');
  await writeFile(iccFile, Buffer.from('fake-icc-profile'));

  // Add: webpmux_add(input, output, profileFile, option)
  const withIcc = path.join(out, 'with-icc.webp');
  await webp.webpmux_add(base, withIcc, iccFile, 'icc');
  console.log('✓ added ICC →', withIcc);

  // Extract: webpmux_extract(input, outFile, option)
  const extracted = path.join(out, 'extracted.icc');
  await webp.webpmux_extract(withIcc, extracted, 'icc');
  console.log('✓ extracted ICC →', extracted);

  // Strip: webpmux_strip(input, output, option)
  const stripped = path.join(out, 'stripped.webp');
  await webp.webpmux_strip(withIcc, stripped, 'icc');
  console.log('✓ stripped ICC →', stripped);
} catch (err) {
  console.error('✗ metadata op failed:', err.message);
  process.exitCode = 1;
}
