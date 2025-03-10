/**
 * Secure client-side encryption & decryption using AES-GCM.
 * Uses Web Crypto API (works in modern browsers).
 */

// Convert a string to a Uint8Array
function encodeUTF8(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

// Convert a Uint8Array to a string
function decodeUTF8(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes);
}

// Generate a secure AES key (only generate once & store it)
export async function generateClientKey(): Promise<CryptoKey> {
  return crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
    "encrypt",
    "decrypt",
  ]);
}

// Derive a key from a passphrase (for persistent storage)
export async function deriveKey(
  password: string,
  salt: string,
): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encodeUTF8(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encodeUTF8(salt),
      iterations: 100000, // High iteration count for security
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
}
/*
// Encrypt function
export async function encryptClient(
  text: string,
  key: CryptoKey,
): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a secure IV
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encodeUTF8(text),
  );

  // Convert to base64 for URL-safe encoding
  const encryptedBytes = new Uint8Array(encrypted);

  return `${btoa(String.fromCharCode(...iv))}.${btoa(String.fromCharCode(...encryptedBytes))}`;
}*/

// Decrypt function
export async function decryptClient(
  encryptedText: string,
  key: CryptoKey,
): Promise<string | null> {
  try {
    const [ivBase64, encryptedBase64] = encryptedText.split(".");

    if (!ivBase64 || !encryptedBase64) return null;

    const iv = new Uint8Array(
      atob(ivBase64)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );
    const encryptedBytes = new Uint8Array(
      atob(encryptedBase64)
        .split("")
        .map((c) => c.charCodeAt(0)),
    );

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedBytes,
    );

    return decodeUTF8(new Uint8Array(decrypted));
  } catch (error) {
    console.error("Decryption failed:", error);

    return null;
  }
}
