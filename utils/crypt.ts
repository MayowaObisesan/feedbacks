import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "your-32-char-random-secret-key"; // Must be 32 bytes
const IV_LENGTH = 12; // Recommended length for AES-GCM

/**
 * Encrypts a query parameter securely
 * @param text The text to encrypt
 * @returns Encrypted string
 */
export function encryptQueryParam(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(SECRET_KEY, "utf-8"),
    iv,
  );
  let encrypted = cipher.update(text, "utf8", "base64");

  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  return Buffer.concat([
    iv,
    Buffer.from(encrypted, "base64"),
    authTag,
  ]).toString("base64url");
}

/**
 * Decrypts an encrypted query parameter
 * @param encryptedText The encrypted string
 * @returns Decrypted string
 */
export function decryptQueryParam(encryptedText: string): string {
  const encryptedBuffer = Buffer.from(encryptedText, "base64url");
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(-16);
  const encryptedData = encryptedBuffer.subarray(
    IV_LENGTH,
    encryptedBuffer.length - 16,
  );

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(SECRET_KEY, "utf-8"),
    iv,
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedData, undefined, "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}
