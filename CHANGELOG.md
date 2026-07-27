# Changelog

## 3.0.0

Major modernization release. The public API (function names and argument order)
is unchanged, so most 2.x code keeps working — but a few behaviors were fixed in
ways that are technically breaking. Please review the migration notes below.

### Security

- **Fixed command injection (CWE-78).** 2.x built a shell command string and ran
  it with `execFile(..., { shell: true })`, so shell metacharacters in any
  filename or option (e.g. an uploaded file name) could execute arbitrary
  commands. All converters now pass a real argv array with **no shell**, so
  every value is handed to the binary verbatim. Thanks to
  [@zachariah-mithani](https://github.com/zachariah-mithani) for reporting and
  the original fix (PR #53).

### Breaking

- **Promises now reject on failure** instead of resolving with the error/stderr.
  Wrap calls in `try/catch` (or `.catch()`) to handle failures.
- **`webpmux_*` functions no longer forward a `logging` flag** to `webpmux`
  (which never supported one). In 2.x this made every `webpmux_*` call fail
  with `Unknown option: -quiet` — silently, because errors were swallowed. The
  `logging` parameter is still accepted for call-site compatibility but ignored.
- **Node.js >= 18 is now required.**

### Fixed

- Filenames/paths **containing spaces** now work (2.x split them into multiple
  arguments).
- Intermediate files for `buffer2webpbuffer` / `str2webpstr` now default to a
  directory under **`os.tmpdir()`** (created on demand) instead of a `temp/`
  folder inside the installed package. This fixes `ENOENT` on a fresh install
  (2.x never created it) and lets conversions work on read-only filesystems
  (Docker, serverless). Temp files are cleaned up even when a conversion fails.
  Pass `extra_path` to override the location.

### Added

- **Custom binary directory.** Point the library at your own libwebp binaries
  (a newer release, or an unbundled platform) via `setBinaryDir(dir)` or the
  `WEBP_CONVERTER_BIN_DIR` environment variable.
- **TypeScript rewrite** shipping type declarations (`.d.ts`) and JSDoc.
- **Dual ESM + CommonJS** build. `import` and `require` both work.
- First real **test suite** (vitest) covering conversions, error handling, and
  the no-shell security behavior.
- Path resolution now prefers native **arm64** binaries (Apple Silicon /
  linux-arm64) when bundled, falling back to the x64 build otherwise.

### Removed

- The `uuid` runtime dependency (replaced by the built-in `crypto.randomUUID()`).
  The package now has **zero runtime dependencies**.
