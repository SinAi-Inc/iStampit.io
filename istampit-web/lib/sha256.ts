export async function sha256Hex(data: BufferSource): Promise<string> {
  // Pass the view directly; only its bytes are hashed and it is a valid BufferSource.
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
