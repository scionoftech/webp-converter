import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

/** The four webp command-line tools this library wraps. */
export type WebpTool = 'cwebp' | 'dwebp' | 'gif2webp' | 'webpmux';

const ALL_TOOLS: readonly WebpTool[] = ['cwebp', 'dwebp', 'gif2webp', 'webpmux'];

// Both the built output (dist/) and the TS sources (src/) live one directory
// below the package root, so the bundled bin/ folder is always one level up.
const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Env var pointing to a directory of custom webp binaries. */
export const BIN_DIR_ENV = 'WEBP_CONVERTER_BIN_DIR';

// Programmatic override set via setBinaryDir(); takes precedence over the env var.
let customBinDir: string | undefined;

/**
 * Point the library at your own directory of webp binaries (e.g. a newer
 * libwebp release, or a platform not bundled with the package). The directory
 * must contain the tools directly: `cwebp`, `dwebp`, `gif2webp`, `webpmux`
 * (with `.exe` extensions on Windows).
 *
 * Pass `undefined` to clear the override and go back to the bundled binaries.
 * Takes precedence over the `WEBP_CONVERTER_BIN_DIR` environment variable.
 */
export function setBinaryDir(dir: string | undefined): void {
  customBinDir = dir && dir.trim() ? dir : undefined;
}

/** The active override directory (programmatic first, then env var), if any. */
function overrideDir(): string | undefined {
  if (customBinDir) return customBinDir;
  const fromEnv = process.env[BIN_DIR_ENV];
  return fromEnv && fromEnv.trim() ? fromEnv : undefined;
}

interface PlatformTarget {
  /** Preferred bin/ subdirectory for the current platform+arch. */
  dir: string;
  /** Fallback subdirectory (e.g. run the x64 build under arm64 emulation). */
  fallback?: string;
  /** Executable extension. */
  ext: string;
}

function resolveTarget(): PlatformTarget {
  const { platform, arch } = process;

  if (platform === 'darwin') {
    return arch === 'arm64'
      ? { dir: 'libwebp_osx_arm64', fallback: 'libwebp_osx', ext: '' }
      : { dir: 'libwebp_osx', ext: '' };
  }

  if (platform === 'linux') {
    return arch === 'arm64'
      ? { dir: 'libwebp_linux_arm64', fallback: 'libwebp_linux', ext: '' }
      : { dir: 'libwebp_linux', ext: '' };
  }

  if (platform === 'win32' && arch === 'x64') {
    return { dir: 'libwebp_win64', ext: '.exe' };
  }

  throw new Error(
    `webp-converter: unsupported platform "${platform}/${arch}". ` +
      'Supported: darwin (x64/arm64), linux (x64/arm64), win32 (x64).',
  );
}

/**
 * Absolute path to the requested webp binary.
 *
 * Resolution order: a directory set via {@link setBinaryDir} → the
 * `WEBP_CONVERTER_BIN_DIR` env var → the bundled binary for this platform
 * (preferring a native arm64 build, falling back to x64 when not bundled).
 */
export function binaryPath(tool: WebpTool): string {
  const exeExt = process.platform === 'win32' ? '.exe' : '';

  // Developer-supplied binaries win over anything bundled. Checked before
  // resolveTarget() so custom binaries work even on platforms we don't bundle.
  const custom = overrideDir();
  if (custom) {
    return path.join(custom, `${tool}${exeExt}`);
  }

  const { dir, fallback, ext } = resolveTarget();
  const primary = path.join(packageRoot, 'bin', dir, 'bin', `${tool}${ext}`);
  if (existsSync(primary)) return primary;

  if (fallback) {
    const alt = path.join(packageRoot, 'bin', fallback, 'bin', `${tool}${ext}`);
    if (existsSync(alt)) return alt;
  }

  // Return the primary path anyway so exec surfaces a clear ENOENT if truly missing.
  return primary;
}

/** Absolute paths to every bundled webp binary for the current platform. */
export function allBinaryPaths(): string[] {
  return ALL_TOOLS.map(binaryPath);
}
