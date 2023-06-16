import type { Channel } from 'pusher-js';
import { writable } from 'svelte/store';

// Channel
export const roomChannel = writable<Channel | null>(null)
