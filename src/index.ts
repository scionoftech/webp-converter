import { chmodSync } from 'node:fs';
import { allBinaryPaths, setBinaryDir } from './binaries.js';
import { base64str2webp, buffer2webp } from './buffer-utils.js';
import { optionTokens, runWebp } from './exec.js';

export type { WebpTool } from './binaries.js';
export { setBinaryDir, BIN_DIR_ENV } from './binaries.js';

/** A single frame passed to {@link webpmux_animate}. */
export interface AnimationFrame {
  /** Path to the source `.webp` frame. */
  path: string;
  /** webpmux frame options, e.g. `"+100"` or `"+100+50+50+1+b"`. */
  offset: string;
}

/**
 * Grant `0o755` to the bundled webp binaries. Required once on Linux/macOS
 * after install, where npm may not preserve the executable bit. No-op-safe to
 * call on Windows.
 */
export function grant_permission(): void {
  for (const exe of allBinaryPaths()) {
    chmodSync(exe, 0o755);
  }
}

/**
 * Convert any image (jpeg, png, …) to webp.
 * @param input_image  Path to the source image.
 * @param output_image Path to write the `.webp` output.
 * @param option       cwebp options, e.g. `"-q 80"`.
 * @param logging      libwebp logging flag (`"-quiet"` by default, `"-v"` for verbose).
 */
export function cwebp(
  input_image: string,
  output_image: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  return runWebp('cwebp', [
    ...optionTokens(option),
    String(input_image),
    '-o',
    String(output_image),
    String(logging),
  ]);
}

/**
 * Convert a webp image back to another format (jpeg, png, …).
 * @param input_image  Path to the source `.webp` image.
 * @param output_image Path to write the decoded output.
 * @param option       dwebp options, e.g. `"-o"`.
 * @param logging      libwebp logging flag.
 */
export function dwebp(
  input_image: string,
  output_image: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  return runWebp('dwebp', [
    String(input_image),
    ...optionTokens(option),
    String(output_image),
    String(logging),
  ]);
}

/**
 * Convert a gif to an (animated) webp.
 * @param input_image  Path to the source `.gif`.
 * @param output_image Path to write the `.webp` output.
 * @param option       gif2webp options, e.g. `"-q 80"`.
 * @param logging      libwebp logging flag.
 */
export function gwebp(
  input_image: string,
  output_image: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  return runWebp('gif2webp', [
    ...optionTokens(option),
    String(input_image),
    '-o',
    String(output_image),
    String(logging),
  ]);
}

// Note: webpmux has no logging flag. The trailing `logging` parameter is kept
// on these functions only for call-site compatibility with 2.x and is ignored
// — forwarding it made every webpmux call fail with "Unknown option" (2.x hid
// this because it resolved on error instead of rejecting).

/**
 * Add an ICC profile, XMP metadata or EXIF metadata to a webp image.
 * @param option  `"icc"`, `"xmp"` or `"exif"`.
 * @param logging Ignored (webpmux has no logging flag); kept for 2.x compatibility.
 */
export function webpmux_add(
  input_image: string,
  output_image: string,
  icc_profile: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  void logging;
  return runWebp('webpmux', [
    '-set',
    ...optionTokens(option),
    String(icc_profile),
    String(input_image),
    '-o',
    String(output_image),
  ]);
}

/**
 * Extract an ICC profile, XMP metadata or EXIF metadata from a webp image.
 * @param option  `"icc"`, `"xmp"` or `"exif"`.
 * @param logging Ignored (webpmux has no logging flag); kept for 2.x compatibility.
 */
export function webpmux_extract(
  input_image: string,
  icc_profile: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  void logging;
  return runWebp('webpmux', [
    '-get',
    ...optionTokens(option),
    String(input_image),
    '-o',
    String(icc_profile),
  ]);
}

/**
 * Strip an ICC profile, XMP metadata or EXIF metadata from a webp image.
 * @param option  `"icc"`, `"xmp"` or `"exif"`.
 * @param logging Ignored (webpmux has no logging flag); kept for 2.x compatibility.
 */
export function webpmux_strip(
  input_image: string,
  output_image: string,
  option: string,
  logging = '-quiet',
): Promise<string> {
  void logging;
  return runWebp('webpmux', [
    '-strip',
    ...optionTokens(option),
    String(input_image),
    '-o',
    String(output_image),
  ]);
}

/**
 * Create an animated webp from an array of webp frames.
 * @param input_images Frames as `{ path, offset }` objects.
 * @param loop         Number of loops (`"0"` = forever).
 * @param bgcolor      Canvas background, e.g. `"255,255,255,255"`.
 * @param logging      Ignored (webpmux has no logging flag); kept for 2.x compatibility.
 */
export function webpmux_animate(
  input_images: AnimationFrame[],
  output_image: string,
  loop: string | number,
  bgcolor: string,
  logging = '-quiet',
): Promise<string> {
  void logging;
  const args: string[] = [];
  for (const frame of input_images) {
    args.push('-frame', String(frame.path), String(frame.offset));
  }
  args.push('-loop', String(loop), '-bgcolor', String(bgcolor), '-o', String(output_image));
  return runWebp('webpmux', args);
}

/**
 * Extract a single frame from an animated webp.
 * @param logging Ignored (webpmux has no logging flag); kept for 2.x compatibility.
 */
export function webpmux_getframe(
  input_image: string,
  output_image: string,
  frame_number: string | number,
  logging = '-quiet',
): Promise<string> {
  void logging;
  return runWebp('webpmux', [
    '-get',
    'frame',
    String(frame_number),
    String(input_image),
    '-o',
    String(output_image),
  ]);
}

/** Convert a base64-encoded image string to a base64-encoded webp string. */
export function str2webpstr(
  base64str: string,
  image_type: string,
  option: string,
  extra_path?: string,
): Promise<string> {
  return base64str2webp(base64str, image_type, option, extra_path);
}

/** Convert an image buffer to a webp buffer. */
export function buffer2webpbuffer(
  buffer: Buffer | Uint8Array,
  image_type: string,
  option: string,
  extra_path?: string,
): Promise<Buffer> {
  return buffer2webp(buffer, image_type, option, extra_path);
}

// Default export mirrors the named exports so both
// `import webp from 'webp-converter'` and `const webp = require('webp-converter')` work.
const webp = {
  grant_permission,
  setBinaryDir,
  cwebp,
  dwebp,
  gwebp,
  webpmux_add,
  webpmux_extract,
  webpmux_strip,
  webpmux_animate,
  webpmux_getframe,
  str2webpstr,
  buffer2webpbuffer,
};

export default webp;
