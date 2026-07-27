import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import webp, {
  buffer2webpbuffer,
  cwebp,
  dwebp,
  grant_permission,
  gwebp,
  str2webpstr,
  webpmux_animate,
  webpmux_getframe,
} from '../src/index';
import { BIN_DIR_ENV, binaryPath, setBinaryDir } from '../src/binaries';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const isWin = process.platform === 'win32';
const exe = (name: string) => (isWin ? `${name}.exe` : name);
const JPG = path.join(root, 'nodejs_logo.jpg');
const GIF = path.join(root, 'linux_logo.gif');
const FRAMES = [0, 1, 2].map((i) => path.join(root, 'frames', `tmp-${i}.webp`));

let out: string;

beforeAll(async () => {
  grant_permission();
  out = await mkdtemp(path.join(tmpdir(), 'webp-test-'));
});

afterAll(async () => {
  await rm(out, { recursive: true, force: true });
});

describe('cwebp / dwebp / gwebp', () => {
  it('converts an image to webp', async () => {
    const dest = path.join(out, 'logo.webp');
    await cwebp(JPG, dest, '-q 80');
    expect((await stat(dest)).size).toBeGreaterThan(0);
  });

  it('round-trips webp back to png', async () => {
    const webpFile = path.join(out, 'rt.webp');
    const png = path.join(out, 'rt.png');
    await cwebp(JPG, webpFile, '-q 80');
    await dwebp(webpFile, png, '-o');
    expect((await stat(png)).size).toBeGreaterThan(0);
  });

  it('converts a gif to webp', async () => {
    const dest = path.join(out, 'anim.webp');
    await gwebp(GIF, dest, '-q 80');
    expect((await stat(dest)).size).toBeGreaterThan(0);
  });
});

describe('buffer / base64 helpers', () => {
  it('buffer2webpbuffer returns a webp buffer', async () => {
    const result = await buffer2webpbuffer(await readFile(JPG), 'jpg', '-q 80');
    expect(Buffer.isBuffer(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('str2webpstr returns a base64 string', async () => {
    const b64 = (await readFile(JPG)).toString('base64');
    const result = await str2webpstr(b64, 'jpg', '-q 80');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('honours a custom temp directory and cleans up after itself', async () => {
    const customTemp = path.join(out, 'custom-temp');
    await buffer2webpbuffer(await readFile(JPG), 'jpg', '-q 80', customTemp);
    const { readdir } = await import('node:fs/promises');
    expect(await readdir(customTemp)).toEqual([]); // no leftover intermediates
  });
});

describe('webpmux animation', () => {
  it('assembles frames and extracts one back', async () => {
    const anim = path.join(out, 'container.webp');
    await webpmux_animate(
      FRAMES.map((p) => ({ path: p, offset: '+100' })),
      anim,
      '10',
      '255,255,255,255',
    );
    expect((await stat(anim)).size).toBeGreaterThan(0);

    const frame = path.join(out, 'frame1.webp');
    await webpmux_getframe(anim, frame, '1');
    expect((await stat(frame)).size).toBeGreaterThan(0);
  });
});

describe('error handling (3.x rejects instead of resolving)', () => {
  it('rejects when the input file does not exist', async () => {
    await expect(
      cwebp(path.join(out, 'nope.jpg'), path.join(out, 'x.webp'), '-q 80'),
    ).rejects.toBeDefined();
  });
});

describe('security & robustness', () => {
  it('does not execute shell metacharacters injected via the option arg (CWE-78)', async () => {
    const marker = path.join(out, 'PWNED');
    // In 2.x, `shell: true` would run the trailing command and create this file.
    await cwebp(JPG, path.join(out, 'inj.webp'), `-q 80; touch ${marker}`).catch(() => {});
    expect(existsSync(marker)).toBe(false);
  });

  it('handles input filenames containing spaces', async () => {
    const spaced = path.join(out, 'name with spaces.jpg');
    await writeFile(spaced, await readFile(JPG));
    const dest = path.join(out, 'spaced out.webp');
    await cwebp(spaced, dest, '-q 80');
    expect((await stat(dest)).size).toBeGreaterThan(0);
  });
});

describe('custom binary directory', () => {
  afterEach(() => {
    setBinaryDir(undefined);
    delete process.env[BIN_DIR_ENV];
  });

  it('defaults to a bundled binary under bin/', () => {
    expect(binaryPath('cwebp')).toContain(`${path.sep}bin${path.sep}`);
  });

  it('setBinaryDir() points resolution at a custom directory', () => {
    setBinaryDir('/opt/webp');
    expect(binaryPath('cwebp')).toBe(path.join('/opt/webp', exe('cwebp')));
    expect(binaryPath('webpmux')).toBe(path.join('/opt/webp', exe('webpmux')));
  });

  it('reads WEBP_CONVERTER_BIN_DIR from the environment', () => {
    process.env[BIN_DIR_ENV] = '/env/webp';
    expect(binaryPath('dwebp')).toBe(path.join('/env/webp', exe('dwebp')));
  });

  it('setBinaryDir() takes precedence over the env var', () => {
    process.env[BIN_DIR_ENV] = '/env/webp';
    setBinaryDir('/prog/webp');
    expect(binaryPath('gif2webp')).toBe(path.join('/prog/webp', exe('gif2webp')));
  });

  it('clearing the override falls back to the bundled binary', () => {
    setBinaryDir('/opt/webp');
    setBinaryDir(undefined);
    expect(binaryPath('cwebp')).toContain(`${path.sep}bin${path.sep}`);
  });

  it('actually converts using binaries resolved from a custom dir', async () => {
    // Point at the same directory the default resolver would use, via override.
    const bundledDir = path.dirname(binaryPath('cwebp'));
    setBinaryDir(bundledDir);
    grant_permission();
    const dest = path.join(out, 'custom-dir.webp');
    await cwebp(JPG, dest, '-q 80');
    expect((await stat(dest)).size).toBeGreaterThan(0);
  });
});

describe('default export parity', () => {
  it('exposes the same functions as named exports', () => {
    expect(typeof webp.cwebp).toBe('function');
    expect(typeof webp.grant_permission).toBe('function');
    expect(typeof webp.webpmux_animate).toBe('function');
  });
});
