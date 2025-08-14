import '@testing-library/jest-dom';

// Attempt to require real opentimestamps; if missing (e.g., resolution issue in Vitest), leave a minimal mock.
try {
  require('opentimestamps');
} catch {
  (globalThis as any).opentimestamps = {
    DetachedTimestampFile: class {
      static deserialize() {
        return { fileHash: () => new Uint8Array(32).fill(0), timestamp: { attestations: [] } } as any;
      }
    },
    OpSHA256: class {}
  };
}

// Basic matchMedia mock for components relying on it (ThemeProvider)
if (typeof window !== 'undefined' && !window.matchMedia) {
  (window as any).matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {}, // deprecated
    removeListener: () => {}, // deprecated
    dispatchEvent: () => false
  });
}
