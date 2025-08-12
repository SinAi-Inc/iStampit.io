declare module 'opentimestamps' {
  export class DetachedTimestampFile {
    constructor(op: any, fileHash: Uint8Array);
    timestamp: any;
    static deserialize(bytes: Uint8Array): DetachedTimestampFile;
    fileHash(): Uint8Array;
  }
  
  export class OpSHA256 {
    // SHA-256 operation class
  }
  
  // Add other exports as needed
  const opentimestamps: any;
  export default opentimestamps;
}
