import { userRouter } from './api/user';
import { t } from '$trpc/t';
import { roomRouter } from './api/room';

export const router = t.router({
    user: userRouter,
    room: roomRouter,
});

export type Router = typeof router;