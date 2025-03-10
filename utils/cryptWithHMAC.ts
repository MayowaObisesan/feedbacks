import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY || "your-32-char-random-secret-key"; // Must be 32 bytes
const HMAC_KEY = process.env.HMAC_KEY || "your-32-char-random-hmac-key"; // Separate key for HMAC
const IV_LENGTH = 12;

/**
 * Encrypts a query param with HMAC signing
 */
export function encryptQueryParamWithHMAC(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(SECRET_KEY, "utf-8"),
    iv,
  );
  let encrypted = cipher.update(text, "utf8", "base64");

  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  // Combine IV + encrypted data + authTag
  const combined = Buffer.concat([
    iv,
    Buffer.from(encrypted, "base64"),
    authTag,
  ]).toString("base64url");

  // Generate HMAC signature
  const hmac = crypto.createHmac("sha256", Buffer.from(HMAC_KEY, "utf-8"));

  hmac.update(combined);
  const signature = hmac.digest("base64url");

  return `${combined}.${signature}`; // Append signature
}

/**
 * Decrypts a query param and verifies HMAC signature
 */
export function decryptQueryParamWithHMAC(
  encryptedText: string,
): string | null {
  const parts = encryptedText.split(".");

  if (parts.length !== 2) return null; // Invalid format

  const encryptedData = parts[0];
  const receivedSignature = parts[1];

  // Verify HMAC signature
  const hmac = crypto.createHmac("sha256", Buffer.from(HMAC_KEY, "utf-8"));

  hmac.update(encryptedData);
  const expectedSignature = hmac.digest("base64url");

  if (receivedSignature !== expectedSignature) {
    console.error("HMAC verification failed! Possible tampering.");

    return null; // Reject tampered data
  }

  // Proceed with decryption
  const encryptedBuffer = Buffer.from(encryptedData, "base64url");
  const iv = encryptedBuffer.subarray(0, IV_LENGTH);
  const authTag = encryptedBuffer.subarray(-16);
  const encryptedContent = encryptedBuffer.subarray(
    IV_LENGTH,
    encryptedBuffer.length - 16,
  );

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(SECRET_KEY, "utf-8"),
    iv,
  );

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedContent, undefined, "utf8");

  decrypted += decipher.final("utf8");

  return decrypted;
}
