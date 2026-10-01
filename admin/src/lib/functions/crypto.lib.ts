import { encryptionKey } from "@/lib/constants";

// Derive an AES-GCM CryptoKey from a passphrase using Web Crypto API
const getCryptoKey = async (passphrase: string): Promise<CryptoKey> => {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("uptechz-salt-constant"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

export const encryptData = async (plainText: string): Promise<string> => {
  if (typeof window === "undefined" || !plainText) return "";
  try {
    const key = await getCryptoKey(encryptionKey || "uptechz_admin_secret_key");
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      enc.encode(plainText)
    );

    const combined = new Uint8Array(iv.byteLength + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.byteLength);

    return btoa(String.fromCharCode(...combined));
  } catch (err) {
    console.error("Encryption error:", err);
    return "";
  }
};

export const decryptData = async (cipherText: string): Promise<string> => {
  if (typeof window === "undefined" || !cipherText) return "";
  try {
    const key = await getCryptoKey(encryptionKey);
    const binaryStr = atob(cipherText);
    const combined = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      combined[i] = binaryStr.charCodeAt(i);
    }

    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    return new TextDecoder().decode(decrypted);
  } catch (err) {
    console.error("Decryption error:", err);
    return "";
  }
};
