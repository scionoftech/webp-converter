# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`webp-converter` is a small, typed Node.js library (v3.x) that wraps Google's precompiled **libwebp** command-line binaries (`cwebp`, `dwebp`, `gif2webp`, `webpmux`) to convert images to/from WebP. There is no native compilation — the platform binaries ship in `bin/` and are shelled out to at runtime. The package has **zero runtime dependencies** and ships **dual ESM + CJS** builds with TypeScript declarations.

## Commands

- `npm run build` — bundle `src/` to `dist/` (ESM `index.js` + CJS `index.cjs` + `.d.ts`) via tsup.
- `npm test` — run the vitest suite (`test/*.test.ts`); `npm run test:watch` for watch mode.
- Run one test: `npx vitest run -t "converts a gif to webp"` (match by name) or `npx vitest run test/converter.test.ts`.
- `npm run typecheck` — `tsc --noEmit`.
- `npm run format` / `npm run format:check` — prettier.

## Architecture

Source is TypeScript in `src/`; internal imports use `.js` extensions (NodeNext style). Public entry point is `src/index.ts` → built to `dist/`.

- **`binaries.ts`** — resolves the absolute path to the right binary. Resolution order: `setBinaryDir()` override → `WEBP_CONVERTER_BIN_DIR` env var → bundled binary for `process.platform`/`process.arch`. The bundled path prefers a native arm64 folder (`libwebp_osx_arm64`, `libwebp_linux_arm64`) and **falls back to the x64 build** via an `existsSync` check when the arm64 binary isn't bundled. An override directory holds the tools flat (`<dir>/cwebp`, `.exe` on Windows) and works even on platforms with no bundled binary. Throws on unsupported platforms only when no override is set.
- **`exec.ts`** — `runWebp(tool, args)` runs a binary with an argv array and **no shell**, returning a Promise. `optionTokens()` splits a free-form option string (`"-q 80"`) into argv tokens.
- **`index.ts`** — the public API. Every converter builds an argv array and delegates to `runWebp`. Exports both named functions and a default object aggregating them (so `import webp` and `require(...)` both work). Function names/argument order are frozen for 2.x compatibility.
- **`buffer-utils.ts` / `temp-path.ts`** — buffer/base64 conversions: write input to a `crypto.randomUUID()` temp file, run cwebp, read back, clean up in a `finally`. `tempDir()` creates the temp directory on demand.

## Invariants — do not regress these

- **Never reintroduce `{ shell: true }`** or string-concatenate values into a command. All binary arguments must flow through the `runWebp` argv array. The shell approach was the 2.x command-injection vulnerability (CWE-78) and also broke filenames with spaces. There is a test asserting injected metacharacters do not execute.
- **Promises reject on binary failure** (2.x resolved with stderr instead). Preserve rejection semantics.
- **`webpmux` has no logging flag.** The `webpmux_*` functions keep a trailing `logging` parameter for call-site compatibility but must **not** forward it to the binary — doing so makes every call fail with `Unknown option`.
- Keep the public function names and argument order stable (`cwebp`, `dwebp`, `gwebp`, `webpmux_*`, `grant_permission`, `str2webpstr`, `buffer2webpbuffer`).

## Gotchas

- **`grant_permission()` must be called before conversions on macOS/Linux** — it `chmod 0o755` the bundled binaries; without it `execFile` fails with EACCES.
- On **Apple Silicon**, until native arm64 binaries are bundled under `bin/libwebp_osx_arm64/`, calls run the x64 build via the fallback (works under Rosetta).

## Updating the bundled binaries

Replace the platform folders under `bin/` with matching libwebp release archives, keeping the `bin/lib<platform>/bin/<tool>` layout, then run the tests. See [CONTRIBUTING.md](CONTRIBUTING.md).
