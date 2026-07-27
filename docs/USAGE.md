# Usage Guide

Complete reference for `webp-converter`. For short, runnable scripts see the
[`examples/`](../examples) folder.

- [Install & import](#install--import)
- [The async / error model](#the-async--error-model)
- [Permissions](#permissions)
- [API reference](#api-reference)
  - [grant_permission](#grant_permission)
  - [cwebp](#cwebpinput_image-output_image-option-logging)
  - [dwebp](#dwebpinput_image-output_image-option-logging)
  - [gwebp](#gwebpinput_image-output_image-option-logging)
  - [buffer2webpbuffer](#buffer2webpbufferbuffer-image_type-option-extra_path)
  - [str2webpstr](#str2webpstrbase64str-image_type-option-extra_path)
  - [webpmux_add / extract / strip](#webpmux_add--webpmux_extract--webpmux_strip)
  - [webpmux_animate](#webpmux_animateinput_images-output_image-loop-bgcolor)
  - [webpmux_getframe](#webpmux_getframeinput_image-output_image-frame_number)
  - [setBinaryDir](#setbinarydirdir)
- [Custom / newer binaries](#custom--newer-binaries)
- [Temp files](#temp-files)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Migrating from 2.x](#migrating-from-2x)

## Install & import

```bash
npm install webp-converter
```

Requires **Node.js >= 18**. The package bundles the libwebp binaries — no system
install or download step.

```js
// ESM / TypeScript
import webp from 'webp-converter';
// or pick functions: import { cwebp, dwebp } from 'webp-converter';

// CommonJS
const webp = require('webp-converter');
```

TypeScript declarations ship with the package; no `@types/...` needed.

## The async / error model

Every conversion function returns a **`Promise`**. It **resolves** with the
tool's stdout/stderr text on success and **rejects** with an `Error` on failure.

```js
try {
  await webp.cwebp('in.jpg', 'out.webp', '-q 80');
} catch (err) {
  console.error('conversion failed:', err.message);
}
```

> **Behavior change from 2.x:** failures now reject instead of silently
> resolving. Always handle rejections.

## Permissions

On Linux/macOS, npm may not preserve the executable bit on the bundled binaries.
Call this **once** before your first conversion:

```js
webp.grant_permission();
```

It `chmod 0o755`s the four binaries and is safe to call on Windows (no-op).

## API reference

Common parameters:

- **`option`** — a raw flag string passed to the underlying tool, e.g.
  `'-q 80'`, `'-lossless'`, `'-resize 200 0'`. See the official docs:
  [cwebp](https://developers.google.com/speed/webp/docs/cwebp) ·
  [dwebp](https://developers.google.com/speed/webp/docs/dwebp) ·
  [gif2webp](https://developers.google.com/speed/webp/docs/gif2webp) ·
  [webpmux](https://developers.google.com/speed/webp/docs/webpmux).
- **`logging`** — `'-quiet'` (default) or `'-v'` for verbose. _(Ignored by the
  `webpmux_*` functions — webpmux has no logging flag.)_

### `grant_permission()`

Makes the bundled binaries executable. Returns `void`.

### `cwebp(input_image, output_image, option, logging?)`

Convert any image (JPEG, PNG, TIFF, …) to WebP.

```js
await webp.cwebp('photo.jpg', 'photo.webp', '-q 80');
await webp.cwebp('logo.png', 'logo.webp', '-lossless');
```

### `dwebp(input_image, output_image, option, logging?)`

Convert a WebP to another format. `-o` writes PNG by default; use format flags
for others.

```js
await webp.dwebp('photo.webp', 'photo.png', '-o');
await webp.dwebp('photo.webp', 'photo.ppm', '-ppm');
```

### `gwebp(input_image, output_image, option, logging?)`

Convert an (animated) GIF to an (animated) WebP.

```js
await webp.gwebp('loading.gif', 'loading.webp', '-q 80');
```

### `buffer2webpbuffer(buffer, image_type, option, extra_path?)`

Convert an in-memory image buffer to a WebP buffer. Returns `Promise<Buffer>`.
`image_type` is the source extension without the dot (`'jpg'`, `'png'`, …).

```js
import { readFile } from 'node:fs/promises';
const webpBuffer = await webp.buffer2webpbuffer(await readFile('in.jpg'), 'jpg', '-q 80');
```

### `str2webpstr(base64str, image_type, option, extra_path?)`

Convert a base64 image string to a base64 WebP string. Returns
`Promise<string>`.

```js
const webpBase64 = await webp.str2webpstr(sourceBase64, 'png', '-q 80');
```

`extra_path` (optional) overrides the temp directory — see [Temp files](#temp-files).

### `webpmux_add` / `webpmux_extract` / `webpmux_strip`

Manage ICC profile, XMP metadata, or EXIF metadata. The metadata `option` is one
of `'icc'`, `'xmp'`, `'exif'`.

```js
// Add a profile/metadata file to a WebP
await webp.webpmux_add('in.webp', 'out.webp', 'profile.icc', 'icc');

// Extract it out to a file
await webp.webpmux_extract('in.webp', 'profile.icc', 'icc');

// Strip it
await webp.webpmux_strip('in.webp', 'out.webp', 'icc');
```

### `webpmux_animate(input_images, output_image, loop, bgcolor)`

Assemble an animated WebP from individual WebP frames.

- **`input_images`** — array of `{ path, offset }`. `offset` uses webpmux
  `FRAME_OPTIONS` syntax: `+duration[+x+y[+dispose[+blend]]]` (e.g. `'+100'` =
  100 ms).
- **`loop`** — number of loops as a string; `'0'` loops forever.
- **`bgcolor`** — canvas background `'A,R,G,B'` (e.g. `'255,255,255,255'`).

```js
const frames = [
  { path: 'f0.webp', offset: '+100' },
  { path: 'f1.webp', offset: '+100' },
  { path: 'f2.webp', offset: '+100' },
];
await webp.webpmux_animate(frames, 'anim.webp', '0', '255,255,255,255');
```

### `webpmux_getframe(input_image, output_image, frame_number)`

Extract a single frame (1-indexed) from an animated WebP.

```js
await webp.webpmux_getframe('anim.webp', 'frame2.webp', '2');
```

### `setBinaryDir(dir)`

Override which binaries are used — see [Custom / newer binaries](#custom--newer-binaries).

```js
import webp, { setBinaryDir } from 'webp-converter';
setBinaryDir('/opt/libwebp-1.7.0/bin');
setBinaryDir(undefined); // reset to bundled
```

## Custom / newer binaries

By default the bundled libwebp binaries are used. To use your own — a newer
libwebp release, or a platform not bundled (e.g. linux-arm64) — provide a
directory containing the tools directly: `cwebp`, `dwebp`, `gif2webp`,
`webpmux` (`.exe` on Windows).

```js
webp.setBinaryDir('/opt/libwebp-1.7.0/bin');
```

Or, without touching code:

```bash
WEBP_CONVERTER_BIN_DIR=/opt/libwebp-1.7.0/bin node app.js
```

**Resolution order:** `setBinaryDir()` → `WEBP_CONVERTER_BIN_DIR` → the bundled
binary for the current platform (native arm64 preferred, falling back to x64).

## Temp files

`buffer2webpbuffer` and `str2webpstr` write a short-lived intermediate file to
disk, then clean it up (even on failure). By default this lives under
`os.tmpdir()`. Override it with the last argument:

```js
await webp.buffer2webpbuffer(buf, 'jpg', '-q 80', '/my/scratch/dir');
```

## Security

- **File paths are safe.** Arguments are passed to the binaries as a real argv
  array with no shell, so spaces and shell metacharacters in filenames are
  inert (this fixes the CWE-78 command injection present in 2.x).
- **Treat `option` as trusted.** The `option` string is split into individual
  CLI flags, so **never** pass untrusted user input as `option` — a caller could
  inject extra flags (e.g. a second `-o` to redirect output). It is meant for
  developer-controlled configuration, not end-user input.

## Troubleshooting

| Symptom                          | Cause / fix                                                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `EACCES` / permission denied     | Call `webp.grant_permission()` once before converting (Linux/macOS).                                              |
| Killed / exit 137 on macOS (dev) | Downloaded binaries carry a quarantine flag: `xattr -dr com.apple.quarantine bin/`. Does not affect npm installs. |
| Promise rejects with tool error  | The underlying binary failed — read `err.message`; run with `'-v'` logging for detail.                            |
| `unsupported platform` thrown    | Your platform isn't bundled; supply binaries via `setBinaryDir()` / `WEBP_CONVERTER_BIN_DIR`.                     |
| linux-arm64 not working          | No arm64 Linux binary is bundled; point `setBinaryDir()` at your own build.                                       |

## Migrating from 2.x

Function names and argument order are unchanged. Key differences:

- Failed conversions **reject** (2.x resolved) — add error handling.
- **Node >= 18** required.
- `webpmux_*` calls now succeed with the default logging (2.x silently failed
  with `Unknown option`).
- Filenames with spaces now work.
- Intermediate temp files default to `os.tmpdir()` instead of inside the package.

Full list: [CHANGELOG.md](../CHANGELOG.md).
