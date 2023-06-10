import { z } from "zod";
import { t } from '$trpc/t'
import { authMiddleware } from "$trpc/middlewares/auth";
import { CODE } from "$lib/const";
import ServerRoom from "$lib/modules/server/Room";

export const roomRouter = t.router({
    isValidRoomname: t.procedure.use(authMiddleware).input(z.object({ roomName: z.string() })).query(async ({ input, ctx }) => {
        const valid = ServerRoom.isRoomnameValid(input.roomName);

        return valid;
    }),
});