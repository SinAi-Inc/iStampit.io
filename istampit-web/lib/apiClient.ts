/**
 * iStampit API Client
 * Configurable client for stamping operations with external API support
 */

// Get API base URL from environment
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';

interface StampResponse {
  hash: string;
  filename: string;
  size: number;
  receiptB64: string;
}

interface HealthResponse {
  ok?: boolean;
  cli_available?: boolean;
  cli_version?: string;
  redis?: 'ok' | 'down' | 'disabled';
  memoryLimiter?: 'ok';
}

/**
 * Create a timestamp for a SHA-256 hash
 */
export async function stampHash(hash: string): Promise<StampResponse> {
  if (!/^[0-9a-f]{64}$/i.test(hash)) {
    throw new Error('Invalid hash format - must be 64-character hex string');
  }

  const endpoint = API_BASE ? `${API_BASE}/stamp` : '/api/stamp';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ hash: hash.toLowerCase() }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'unknown' }));
    throw new Error(errorData.error || `Stamp failed with status ${response.status}`);
  }

  const data = await response.json();

  if (!data.receiptB64) {
    throw new Error('Invalid response - missing receipt');
  }

  return data as StampResponse;
}

/**
 * Check API health status
 */
export async function healthz(): Promise<HealthResponse> {
  const endpoint = API_BASE ? `${API_BASE}/healthz` : '/api/healthz';

  const response = await fetch(endpoint, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`API unavailable - status ${response.status}`);
  }

  return response.json() as Promise<HealthResponse>;
}

/**
 * Download a receipt file directly (binary response)
 */
export async function downloadReceipt(hash: string): Promise<Uint8Array> {
  if (!/^[0-9a-f]{64}$/i.test(hash)) {
    throw new Error('Invalid hash format - must be 64-character hex string');
  }

  const endpoint = API_BASE ? `${API_BASE}/stamp/${hash}.ots` : `/api/stamp/${hash}.ots`;

  const response = await fetch(endpoint, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'unknown' }));
    throw new Error(errorData.error || `Download failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return new Uint8Array(arrayBuffer);
}

/**
 * Utility to convert base64 receipt to bytes
 */
export function base64ToBytes(base64: string): Uint8Array {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (error) {
    throw new Error('Failed to decode base64 receipt');
  }
}

/**
 * Get the configured API base URL
 */
export function getApiBase(): string {
  return API_BASE;
}

/**
 * Check if using external API
 */
export function isExternalApi(): boolean {
  return Boolean(API_BASE && API_BASE.startsWith('http'));
}
