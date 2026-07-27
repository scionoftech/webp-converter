import { randomUUID } from 'node:crypto';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { optionTokens, runWebp } from './exec.js';
import { tempDir } from './temp-path.js';

/**
 * Write `data` to a temp file, convert it to webp with cwebp, read the result
 * back, and always clean up both temp files (even if conversion fails).
 */
async function encodeToWebp(
  data: Buffer,
  imageType: string,
  option: string,
  extraPath?: string,
): Promise<Buffer> {
  const dir = tempDir(extraPath);
  const id = randomUUID();
  const inputPath = path.join(dir, `${id}.${imageType}`);
  const webpPath = path.join(dir, `${id}.webp`);

  await writeFile(inputPath, data);
  try {
    await runWebp('cwebp', [...optionTokens(option), inputPath, '-o', webpPath, '-quiet']);
    return await readFile(webpPath);
  } finally {
    await Promise.allSettled([unlink(inputPath), unlink(webpPath)]);
  }
}

/** Convert a base64-encoded image string to a base64-encoded webp string. */
export async function base64str2webp(
  base64str: string,
  imageType: string,
  option: string,
  extraPath?: string,
): Promise<string> {
  const webp = await encodeToWebp(Buffer.from(base64str, 'base64'), imageType, option, extraPath);
  return webp.toString('base64');
}

/** Convert an image buffer to a webp buffer. */
export async function buffer2webp(
  buffer: Buffer | Uint8Array,
  imageType: string,
  option: string,
  extraPath?: string,
): Promise<Buffer> {
  return encodeToWebp(Buffer.from(buffer), imageType, option, extraPath);
}
