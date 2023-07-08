import { NODE_ENV } from "$env/static/private";
import { adminMiddleware } from "$trpc/middlewares/admin";
import { authMiddleware } from "$trpc/middlewares/auth";
import { t } from "$trpc/t";
import { kv } from "@vercel/kv";
import { z } from "zod";

interface ServiceSettings {
    underMaintenance: boolean
}

const SERVICE_SETTINGS_KEY = `${NODE_ENV}:settings:service`;

export const serviceRouter = t.router({
    getServiceSettings: t.procedure.use(authMiddleware).query(async ({ input, ctx }) => {
        let settings: ServiceSettings | null = await kv.get(SERVICE_SETTINGS_KEY);

        if (settings === null) {
            await kv.set<ServiceSettings>(SERVICE_SETTINGS_KEY, {
                underMaintenance: false
            });
            settings = await kv.get(SERVICE_SETTINGS_KEY);
        }

        return settings;
    }),
    setServiceSettings: t.procedure.use(adminMiddleware).input(z.any()).query(async ({ input, ctx }) => {
        await kv.set<ServiceSettings>(SERVICE_SETTINGS_KEY, input as ServiceSettings);
        let settings = await kv.get(SERVICE_SETTINGS_KEY);
        return settings as ServiceSettings;
    }),
})