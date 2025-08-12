import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      opentimestamps: path.resolve(__dirname, 'tests/__stubs__/opentimestamps.ts')
    }
  }
});
