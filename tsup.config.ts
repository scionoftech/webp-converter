import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'node18',
  dts: true,
  clean: true,
  sourcemap: true,
  // Polyfill import.meta.url in the CJS build (used to locate the bundled bin/ dir).
  shims: true,
});
