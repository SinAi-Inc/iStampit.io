import '@testing-library/jest-dom';

// Attempt to require real opentimestamps; if missing (e.g., resolution issue in Vitest), leave a minimal mock.
try {
  require('opentimestamps');
} catch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).opentimestamps = {
    DetachedTimestampFile: class {
      static deserialize() {
        return { fileHash: () => new Uint8Array(32).fill(0), timestamp: { attestations: [] } } as any;
      }
    },
    OpSHA256: class {}
  };
}
