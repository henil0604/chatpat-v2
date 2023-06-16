import { kv } from "@vercel/kv";
import Logger from "$lib/modules/Logger";

interface CachifyOptions {
    timeout: number,
    force: boolean
}
export default class ServerCache {
    private constructor() { }

    public static async cachify<T>(key: string, fallback: () => T, options?: Partial<CachifyOptions>): Promise<T> {
        const startTime = Date.now();
        let returnData: T | null = null;
        if (!options?.force) {
            const storedData: any = await kv.get(key);
            options = options || {}
            if (storedData) {
                returnData = storedData;
            }
        }
        if (options.force || returnData === null) {
            Logger.log(`warn`, `{cachify}:{${key}}:not_found`)
            const newData = await fallback();
            await kv.set(key, newData, { px: options.timeout || 0 });
            returnData = newData;
        }
        const endTime = Date.now();
        !options.force && Logger.log("info", `cachify:${key}:${endTime - startTime}ms`)
        return returnData as T;
    }

}