//customStorage.tsx

import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { TextEncoder, TextDecoder } from 'text-encoding';

const isWeb = Platform.OS === 'web';
const password = 'your-encryption-password';

const enc = new TextEncoder();
const dec = new TextDecoder();

let isSaving = false;

if (!isWeb) {
    SecureStore.setItemAsync('keys', JSON.stringify([]));
    console.log("keys set");
}

const getKeyMaterial = (password: string): Promise<CryptoKey> => {
    return crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        'PBKDF2',
        false,
        ['deriveKey']
    );
};

const getKey = (keyMaterial: CryptoKey, salt: string): Promise<CryptoKey> => {
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: enc.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );
};

interface EncryptedData {
    iv: number[];
    data: number[];
}

const encryptData = async (data: string, password: string): Promise<EncryptedData> => {
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, 'salt');
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        enc.encode(data)
    );
    return { iv: Array.from(iv), data: Array.from(new Uint8Array(encrypted)) };
};

const decryptData = async (encryptedData: EncryptedData, password: string): Promise<string> => {
    const { iv, data } = encryptedData;
    const keyMaterial = await getKeyMaterial(password);
    const key = await getKey(keyMaterial, 'salt');
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        key,
        new Uint8Array(data)
    );
    return dec.decode(decrypted);
};

const customStorage = {
    async getItem(key: string): Promise<string | null> {
        if (isWeb) {
            const encryptedData = sessionStorage.getItem(key);
            if (encryptedData) {
                return await decryptData(JSON.parse(encryptedData), password);
            }
            return null;
        } else {
            return await SecureStore.getItemAsync(key);
        }
    },
    async setItem(key: string, value: string): Promise<void> {
        console.log("setItem key: ", key);
        if (isWeb) {
            const encryptedData = await encryptData(value, password);
            sessionStorage.setItem(key, JSON.stringify(encryptedData));
        } else {
            await SecureStore.setItemAsync(key, value);
            await customStorage.saveKey(key);
        }
    },
    async removeItem(key: string): Promise<void> {
        if (isWeb) {
            sessionStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
            await customStorage.removeKey(key);
        }
    },
    async clear(): Promise<void> {
        if (isWeb) {
            sessionStorage.clear();
        } else {
            const keys = await SecureStore.getItemAsync('keys');
            if (keys) {
                const parsedKeys = JSON.parse(keys);
                for (const key of parsedKeys) {
                    await SecureStore.deleteItemAsync(key);
                }
                await SecureStore.deleteItemAsync('keys');
            }
        }
    },
    

    async saveKey(key: string): Promise<void> {
    while (isSaving) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    isSaving = true;

    try {
        const keys = await SecureStore.getItemAsync('keys');
        const parsedKeys = keys ? JSON.parse(keys) : [];

        if (!parsedKeys.includes(key)) {
            parsedKeys.push(key);
            await SecureStore.setItemAsync('keys', JSON.stringify(parsedKeys));
            console.log("key saved", key);
            const newKeys = await SecureStore.getItemAsync('keys');
            console.log("newKeys: ", newKeys); 
        }
    } finally {
        isSaving = false;
    }
    },
        
    async removeKey(key: string): Promise<void> {
        const keys = await SecureStore.getItemAsync('keys');
        if (keys) {
            const parsedKeys = JSON.parse(keys);
            const index = parsedKeys.indexOf(key);
            if (index !== -1) {
                parsedKeys.splice(index, 1);
                await SecureStore.setItemAsync('keys', JSON.stringify(parsedKeys));
            }
        }
    },
    async getAllKeys(): Promise<string[]> {
        if (isWeb) {
            const keys = Object.keys(sessionStorage);
            return keys.filter(key => key !== 'keys');
        } else {
            const keys = await SecureStore.getItemAsync('keys');
            return keys ? JSON.parse(keys) : [];
        }
    }
};

export default customStorage;
