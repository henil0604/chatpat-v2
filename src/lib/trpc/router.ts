import { userRouter } from './api/user';
import { t } from '$trpc/t';
import { roomRouter } from './api/room';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { serviceRouter } from './api/service';

export const router = t.router({
    user: userRouter,
    room: roomRouter,
    service: serviceRouter,
});

export type Router = typeof router;
export type RouterInput = inferRouterInputs<Router>;
export type RouterOutput = inferRouterOutputs<Router>;