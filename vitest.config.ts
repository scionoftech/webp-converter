import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // Spawning webp binaries + file IO can be slower than the default 5s on CI.
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});
