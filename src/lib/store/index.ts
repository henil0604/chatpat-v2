import { writable } from "svelte/store";

export let loading = writable(false);

export let userWalletBalance = writable(0);