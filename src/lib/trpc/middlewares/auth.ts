import { t } from '$trpc/t';
import { TRPCError } from '@trpc/server';

export const authMiddleware = t.middleware(async ({ next, ctx }) => {
    const user = await ctx.user;
    if (!user) throw new TRPCError({ code: 'UNAUTHORIZED' });
    return next();
});