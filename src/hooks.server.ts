// @ts-nocheck

import { AUTH_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECERT } from '$env/static/private';
import { prisma } from '$lib/db';
import { createContext } from '$lib/trpc/context';
import { router } from '$lib/trpc/router';
import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { createTRPCHandle } from 'trpc-sveltekit';
import GithubProvider from '@auth/core/providers/github'

const trpcHandle: Handle = createTRPCHandle({ router, createContext });

const authHandle: Handle = SvelteKitAuth({
    providers: [
        GithubProvider({
            clientId: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECERT
        })
    ],
    secret: AUTH_SECRET,
    // @ts-ignore
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: async ({ session, user }) => {

            if (session.user) {
                // @ts-ignore
                session.user.id = user.id;
            }

            try {
            } catch (e) {
                console.log(`[hooks][callbacks][session]`, e, 'error')
            }

            return session;
        }
    },
    events: {
        async createUser({ user }) {
        }
    }
})

const sessionHandle: Handle = async ({ event, resolve }) => {
    const session = await event.locals.getSession()

    event.locals.user = session?.user || null;

    return resolve(event);
}

export const handle = sequence(authHandle, trpcHandle, sessionHandle);