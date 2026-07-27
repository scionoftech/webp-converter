// Convert in memory: image buffer -> webp buffer, and base64 -> base64.
// Useful for HTTP uploads/responses where you never touch disk yourself.
import webp from '../dist/index.js';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');
const out = path.join(here, 'output');

webp.grant_permission();

try {
  const source = await readFile(path.join(root, 'nodejs_logo.jpg'));

  // buffer2webpbuffer(buffer, imageType, option, extraPath?) -> Promise<Buffer>
  const webpBuffer = await webp.buffer2webpbuffer(source, 'jpg', '-q 80');
  await writeFile(path.join(out, 'from-buffer.webp'), webpBuffer);
  console.log('✓ buffer → webp buffer:', webpBuffer.length, 'bytes');

  // str2webpstr(base64, imageType, option, extraPath?) -> Promise<string>
  const base64 = source.toString('base64');
  const webpBase64 = await webp.str2webpstr(base64, 'jpg', '-q 80');
  console.log('✓ base64 → webp base64:', webpBase64.slice(0, 24) + '…');

  // Intermediate temp files default to os.tmpdir(); pass a 4th arg to override:
  //   await webp.buffer2webpbuffer(source, 'jpg', '-q 80', '/my/temp/dir');
} catch (err) {
  console.error('✗ in-memory conversion failed:', err.message);
  process.exitCode = 1;
}
