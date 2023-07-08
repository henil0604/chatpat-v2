import type { Session } from "@auth/core/types";
import { writable } from "svelte/store";
import { persisted } from 'svelte-local-storage-store'
import System from "$lib/modules/System";
import type { RouterOutput } from "$trpc/router";

export let loading = writable(false);

export let userWalletBalance = writable(0);

export let userStore = writable<Session["user"] | null | undefined>(null);

export const darkMode = persisted<boolean>("chatpatDarkMode", false)

export let settingsStore = writable<RouterOutput["service"]["getServiceSettings"]>(null);