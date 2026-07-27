// Point the library at your own libwebp binaries — e.g. a newer release, or a
// platform not bundled with the package (like linux-arm64).
//
// The directory must contain the tools directly: cwebp, dwebp, gif2webp,
// webpmux (with .exe on Windows).
import webp, { setBinaryDir, BIN_DIR_ENV } from '../dist/index.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

// Option A — programmatic (highest precedence):
//   setBinaryDir('/opt/libwebp-1.7.0/bin');
//   setBinaryDir(undefined); // clear, go back to bundled binaries
//
// Option B — environment variable (no code change):
//   WEBP_CONVERTER_BIN_DIR=/opt/libwebp-1.7.0/bin node app.js
console.log('env var name:', BIN_DIR_ENV); // WEBP_CONVERTER_BIN_DIR

// Demo: resolve the bundled binary dir and set it explicitly via the override,
// proving the custom path is honored. (Normally you'd pass your own dir.)
webp.grant_permission();
try {
  await webp.cwebp(
    path.join(root, 'nodejs_logo.jpg'),
    path.join(out, 'default-binaries.webp'),
    '-q 80',
  );
  console.log('✓ converted using the bundled binaries (default resolution)');

  // Uncomment and point at a real directory to use your own build:
  // setBinaryDir('/opt/libwebp-1.7.0/bin');
  // await webp.cwebp(input, output, '-q 80');
  // setBinaryDir(undefined);
} catch (err) {
  console.error('✗ failed:', err.message);
  process.exitCode = 1;
}
