// Local stub for the 'opentimestamps' package used only in tests.
// Provides the minimal surface consumed by OtsVerifier.

export class OpSHA256 {}

export class DetachedTimestampFile {
  private _hash: Uint8Array = new Uint8Array(32).fill(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp: any;

  constructor(_op?: any, hash?: Uint8Array) {
    if (hash) this._hash = hash;
  }

  static deserialize(_bytes: Uint8Array) {
    const inst = new DetachedTimestampFile();
    // Use the well-known empty file SHA-256 so tests can assert if needed.
    inst._hash = Uint8Array.from(Buffer.from('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'hex'));
    inst.timestamp = {
      attestations: [
        { type: 'Calendar', url: 'https://calendar.example' }
      ]
    };
    return inst as any;
  }

  fileHash() {
    return this._hash;
  }
}

export default { DetachedTimestampFile, OpSHA256 };
