import { ProtectedRoutes } from "$lib/const";

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

}

export default System;