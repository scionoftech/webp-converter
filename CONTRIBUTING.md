# Contributing

Thanks for helping maintain webp-converter.

## Development

```bash
npm install       # install the dev toolchain (no runtime deps)
npm run build     # build dual ESM/CJS output + type declarations to dist/
npm test          # run the vitest suite
npm run typecheck # type-check without emitting
npm run format    # format with prettier
```

The library is a thin, typed wrapper around the precompiled
[libwebp](https://developers.google.com/speed/webp) binaries bundled under
`bin/`. Source lives in `src/`:

- `binaries.ts` — resolves the correct binary for the current platform/arch.
- `exec.ts` — runs a binary with an argv array and **no shell** (never
  reintroduce `{ shell: true }` — that was the 2.x command-injection bug).
- `index.ts` — the public API (keep function names/argument order stable).
- `buffer-utils.ts`, `temp-path.ts` — buffer/base64 helpers and temp handling.

## Guidelines

- Every value passed to a binary must go through the argv array in `runWebp`,
  never string-concatenated into a command.
- Add or update a test in `test/` for any behavior change.
- Run `npm run format`, `npm run typecheck`, and `npm test` before opening a PR.

## Updating the bundled binaries

Replace the platform folders under `bin/` with the matching release archives
from the [libwebp downloads](https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html),
keeping the existing `bin/lib<platform>/bin/<tool>` layout, then run the tests.
