import { z } from "zod";
import { t } from '$trpc/t'
import { authMiddleware } from "$trpc/middlewares/auth";
import { CODE, COST, REWARD } from "$lib/const";
import ServerRoom from "$lib/modules/server/Room";
import ServerUser from "$lib/modules/server/User";
import { error } from "@sveltejs/kit";
import { TRPCError } from "@trpc/server";
import ServerChat from "$lib/modules/server/Chat";
import ServerCache from "$lib/modules/server/Cache";
import Logger from "$lib/modules/Logger";
import pusher from "$lib/modules/server/pusher";

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
    }),

    delete: t.procedure.use(authMiddleware).input(z.object({
        roomName: z.string()
    })).query(async ({ input, ctx }) => {

        const user = ctx.user!;

        const room = await ServerRoom.getByName(input.roomName);

        if (!room) {
            throw new TRPCError({ code: 'NOT_FOUND' })
        }

        if (room?.ownerId !== user.id) {
            throw new TRPCError({ code: 'UNAUTHORIZED' })
        }

        try {
            await ServerRoom.deleteByName(input.roomName);
        } catch (e) {
            return {
                error: true,
                code: CODE.ERROR,
                message: "Something went wrong"
            }
        }

        return {
            error: false,
            code: CODE.DONE,
            message: "Room deleted"
        }
    }),

    doesExists: t.procedure.use(authMiddleware).input(z.object({
        roomName: z.string()
    })).query(async ({ input, ctx }) => {

        let room: Awaited<ReturnType<typeof ServerRoom["getByName"]>>;

        try {
            room = await ServerRoom.getByName(input.roomName);
        } catch (e) {
            throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        if (!room) {
            return {
                error: true,
                code: CODE.DONE,
                message: "Room does not exists",
                exists: false,
            }
        }

        return {
            error: false,
            code: CODE.DONE,
            message: "Room exists",
            exists: true
        }
    }),

    sendMessage: t.procedure.use(authMiddleware).input(z.object({
        id: z.string(),
        replyChatId: z.string().optional(),
        message: z.string(),
        createdAt: z.number(),
        roomName: z.string()
    })).query(async ({ input, ctx }) => {

        const user = ctx.user!;

        const room = await ServerCache.cachify(`r-${input.roomName}`, () => ServerRoom.getByName(input.roomName), { timeout: 1000 * 60 * 1 });

        if (!room) {
            throw new TRPCError({
                code: 'NOT_FOUND'
            });
        }

        const message = await ServerChat.create(input.message, user.username as string, input.roomName, input.createdAt, input.id, input.replyChatId || undefined);

        await ServerUser.changeWalletBalance(user.id as string, REWARD.MESSAGE_SEND);

        return {
            code: CODE.DONE,
            message: 'Message sent',
            data: {
                id: message.id
            }
        }
    }),

    unsendMessage: t.procedure.use(authMiddleware).input(z.object({
        id: z.string(),
    })).query(async ({ input, ctx }) => {

        const user = ctx.user!;

        const chat = await ServerChat.getById(input.id)

        if (chat?.ownerId !== user.id) {
            throw new TRPCError({
                code: 'FORBIDDEN'
            });
        }

        await ServerChat.deleteById(input.id);

        return {
            code: CODE.DONE,
            message: 'Chat deleted',
            data: {
                id: input.id
            }
        }
    })

});