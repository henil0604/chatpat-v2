import type ServerRoom from "$lib/modules/server/Room";
import { writable } from "svelte/store";

export let roomStore = writable<Awaited<ReturnType<(typeof ServerRoom)["getByName"]>>>(null);

export let roomAccess = writable(false);

export let isMessageBeingSent = writable(false);

export type chats = Required<Awaited<ReturnType<(typeof ServerRoom)["getSortedChats"]>>>
export let chatsStore = writable<chats>([])

interface ChatMeta {
    id: string,
    sending: boolean,
    failed: boolean,
}
export let chatsMetaStore = writable<ChatMeta[]>([])