import type { Channel } from 'pusher-js';
import { writable } from 'svelte/store';

export const globalChannel = writable<Channel | null>(null);
export const roomChannel = writable<Channel | null>(null);