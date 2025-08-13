import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      'tests-e2e/**', // handled by Playwright
      'node_modules/**',
      'dist/**'
    ]
  },
  resolve: {
    alias: {
      opentimestamps: path.resolve(__dirname, 'tests/__stubs__/opentimestamps.ts')
    }
  }
});
