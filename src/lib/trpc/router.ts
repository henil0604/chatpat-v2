import { userRouter } from './api/user';
import { t } from '$trpc/t';

export const router = t.router({
    user: userRouter
});

export type Router = typeof router;