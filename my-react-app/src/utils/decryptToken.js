import CryptoJS from 'crypto-js'; // Import CryptoJS for token decryption

// Helper function to decrypt the token
export const decryptToken = (encryptedToken, secretKey) => {
    if (!encryptedToken) {
      console.error("No token found in localStorage.");
      return null;
    }
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
      const token = bytes.toString(CryptoJS.enc.Utf8);
      return token || null;
    } catch (error) {
      console.error("Error decrypting token:", error);
      return null;
    }
  };