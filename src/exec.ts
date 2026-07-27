import { execFile } from 'node:child_process';
import { binaryPath, type WebpTool } from './binaries.js';

/**
 * Split a free-form option string (e.g. `"-q 80"`) into individual argv tokens.
 * `null`/`undefined`/empty produce no tokens.
 */
export function optionTokens(option: unknown): string[] {
  if (option == null) return [];
  return String(option).trim().split(/\s+/).filter(Boolean);
}

/**
 * Run a webp binary with a real argv array and **no shell**.
 *
 * Each argument is passed to the binary verbatim, so filenames or options
 * containing spaces or shell metacharacters can never be re-interpreted as a
 * command. This closes the command-injection hole (CWE-78) present in every
 * 2.x release, where arguments were concatenated into a `sh -c` string.
 *
 * Rejects when the binary exits non-zero (2.x silently resolved instead).
 */
export function runWebp(tool: WebpTool, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    execFile(binaryPath(tool), args, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout || stderr);
    });
  });
}
