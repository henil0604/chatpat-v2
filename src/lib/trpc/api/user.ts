import { z } from "zod";
import { t } from '$trpc/t'
import { authMiddleware } from "$trpc/middlewares/auth";
import { CODE } from "$lib/const";
import ServerUser from "$lib/modules/server/User";

export const userRouter = t.router({
    isValidUsername: t.procedure.use(authMiddleware).input(z.object({ username: z.string() })).query(async ({ input, ctx }) => {
        const valid = await ServerUser.isUsernameValid(input.username);

        return valid;
    }),
    onBoardingComplete: t.procedure.use(authMiddleware).input(z.object({ username: z.string() })).query(async ({ input, ctx: { user } }) => {
        const usernameCheck = await ServerUser.isUsernameValid(input.username);
        if (!usernameCheck.valid) {
            return {
                code: CODE.INVALID,
                error: true,
                message: usernameCheck.message
            };
        }

        try {
            const set = await ServerUser.setProperty({ id: user?.id }, "username", input.username);
        } catch (e) {
            return {
                code: CODE.ERROR,
                error: true,
                message: "Something went wrong"
            }
        }


        return {
            code: CODE.DONE,
            error: false,
            message: "Successfully completed profile"
        }
    }),
    getUserWalletBalance: t.procedure.use(authMiddleware).query(async ({ input, ctx }) => {
        const user = ctx.user!;
        return user.wallet.balance;
    })

});