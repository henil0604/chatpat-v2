import { z } from "zod";
import { t } from '$trpc/t'
import { authMiddleware } from "$trpc/middlewares/auth";
import { CODE, COST } from "$lib/const";
import ServerRoom from "$lib/modules/server/Room";
import ServerUser from "$lib/modules/server/User";

export const roomRouter = t.router({
    isValidRoomname: t.procedure.use(authMiddleware).input(z.object({ roomName: z.string() })).query(async ({ input, ctx }) => {
        const valid = ServerRoom.isRoomnameValid(input.roomName);

        return valid;
    }),

    create: t.procedure.use(authMiddleware).input(z.object({
        roomName: z.string(),
        visibility: z.string(),
        password: z.string().optional()
    })).query(async ({ input, ctx }) => {

        const user = ctx.user!;
        const valid = await ServerRoom.isRoomnameValid(input.roomName);

        if (!valid.valid) {
            return {
                code: CODE.INVALID,
                error: true,
                message: valid.message
            };
        }

        const cost = COST.CREATE_ROOM[
            input.visibility.toUpperCase() as keyof typeof COST.CREATE_ROOM
        ];
        const hasEnoughCoins = ServerUser.hasEnoughCoins(user.wallet.balance, cost);

        if (!hasEnoughCoins) {
            return {
                code: CODE.NOT_ENOUGH_COINS,
                error: true,
                message: 'Not Enough Coins'
            }
        }

        try {
            const create = await ServerRoom.createRoom(user.id as string, input.roomName, input.visibility, input.password);
        } catch (e) {
            console.error(`[trpc.room.create][createRoom]`, e);
            return {
                error: true,
                code: CODE.ERROR,
                message: 'Something went wrong'
            }
        }

        try {
            await ServerUser.changeWalletBalance(user.id as string, -cost);
        } catch (e) {
            console.error(`[trpc.room.create][changeWalletBalance]`, e);
            return {
                error: true,
                code: CODE.ERROR,
                message: 'Something went wrong'
            }
        }

        return {
            code: CODE.DONE,
            error: false,
            message: 'Room created'
        };
    })
});