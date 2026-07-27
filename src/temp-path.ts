import { existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

/**
 * Resolve the directory used for intermediate files during buffer/base64
 * conversions, creating it if it does not exist. Pass `extraPath` to use your
 * own directory; otherwise a `webp-converter/` folder under the OS temp
 * directory is used.
 *
 * Unlike 2.x (which wrote inside the installed package and threw `ENOENT` on a
 * fresh install), the default lives under `os.tmpdir()` so conversions work on
 * read-only filesystems (Docker, serverless) and are created on demand.
 */
export function tempDir(extraPath?: string): string {
  const dir = extraPath && extraPath.trim() ? extraPath : path.join(tmpdir(), 'webp-converter');
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  return dir;
}
