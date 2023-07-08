import { ADMIN_EMAILS } from '$lib/const';
import { t } from '$trpc/t';
import { TRPCError } from '@trpc/server';

export const adminMiddleware = t.middleware(async ({ next, ctx }) => {
    const user = await ctx.user;
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    if (ADMIN_EMAILS.includes(user?.email as string) === false) throw new TRPCError({ code: 'FORBIDDEN' });
    return next();
});