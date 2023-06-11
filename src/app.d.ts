// See https://kit.svelte.dev/docs/types#app

import type { DefaultSession, Session } from "@auth/core/types";
import type { Wallet } from "@prisma/client";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Session["user"] | null
		}
		interface PageData {
			user?: Locals["user"]
		}
		// interface Platform {}
	}
}


declare module '@auth/core/types' {
	interface Session {
		user: {
			id?: string | null
			username?: string | null,
			wallet: Wallet
		} & DefaultSession["user"]
	}
}


export { };
