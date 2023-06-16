import type { Session } from "@auth/core/types";
import { writable } from "svelte/store";

export let loading = writable(false);

export let userWalletBalance = writable(0);

export let userStore = writable<Session["user"] | null | undefined>(null);