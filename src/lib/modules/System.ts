import { ProtectedRoutes } from "$lib/const";
import CryptoJS from 'crypto-js'

class System {
    private constructor() { }

    public static isProtectedRoute(url: string, Routes: string[] = ProtectedRoutes) {
        return Routes.some(route => {
            if (route === '*') {
                // Wildcard match - all routes are protected
                return true;
            } else if (route.endsWith('*')) {
                // Prefix wildcard match - match all routes that start with the prefix
                const prefix = route.slice(0, -1);
                return url.startsWith(prefix);
            } else if (route.startsWith('*')) {
                // Suffix wildcard match - match all routes that end with the suffix
                const suffix = route.slice(1);
                return url.endsWith(suffix);
            } else {
                // Exact match
                return url === route;
            }
        });
    }

    public static randomString(length: number, current?: string): string {
        current = current ? current : '';
        return length ? System.randomString(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
    }

    public static hash(text: string) {
        return CryptoJS.SHA256(text).toString(CryptoJS.enc.Hex)
    }

    public static encryptAES(text: string, password: string) {
        return CryptoJS.AES.encrypt(text, password).toString();
    }

    public static decryptAES(text: string, password: string) {
        return CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    }

}

export default System;