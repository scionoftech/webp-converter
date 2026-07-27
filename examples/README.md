# Examples

Runnable examples for `webp-converter`. They import from the local build
(`../dist/index.js`), so build once first:

```bash
npm install
npm run build
```

Then run any example with Node (18+). Output files are written to
`examples/output/` (gitignored).

```bash
node examples/01-image-to-webp.mjs
node examples/02-webp-to-image.mjs
node examples/03-gif-to-webp.mjs
node examples/04-buffers-and-base64.mjs
node examples/05-metadata.mjs
node examples/06-animation.mjs
node examples/07-custom-binaries.mjs
node examples/commonjs.cjs
```

| File                        | Shows                                                      |
| --------------------------- | ---------------------------------------------------------- |
| `01-image-to-webp.mjs`      | `cwebp` — JPEG/PNG → WebP                                  |
| `02-webp-to-image.mjs`      | `dwebp` — WebP → PNG/JPEG                                  |
| `03-gif-to-webp.mjs`        | `gwebp` — animated GIF → animated WebP                     |
| `04-buffers-and-base64.mjs` | `buffer2webpbuffer` / `str2webpstr` — in-memory conversion |
| `05-metadata.mjs`           | `webpmux_add` / `_extract` / `_strip` — ICC/XMP/EXIF       |
| `06-animation.mjs`          | `webpmux_animate` / `webpmux_getframe`                     |
| `07-custom-binaries.mjs`    | `setBinaryDir` / `WEBP_CONVERTER_BIN_DIR`                  |
| `commonjs.cjs`              | Same API via CommonJS `require`                            |

> In your own project, replace `../dist/index.js` with `'webp-converter'`:
> `import webp from 'webp-converter'` (or `const webp = require('webp-converter')`).

See [../docs/USAGE.md](../docs/USAGE.md) for the full guide.
