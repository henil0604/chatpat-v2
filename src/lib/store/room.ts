import type ServerRoom from "$lib/modules/server/Room";
import { get, writable } from "svelte/store";

export let roomStore = writable<Awaited<ReturnType<(typeof ServerRoom)["getByName"]>>>(null);

export let roomAccess = writable(false);

export let isMessageBeingSent = writable(false);

export type chats = Required<Awaited<ReturnType<(typeof ServerRoom)["getSortedChats"]>>>
export type chat = chats[number];
export let chatsStore = writable<chats>([])

interface ChatMeta {
    id: string,
    stored: boolean,
    failed: boolean,
    broadcasted: boolean
}
export let chatsMetaStore = writable<ChatMeta[]>([])


export function addChat(data: chat) {
    chatsStore.update((val) => {
        return [...val, data]
    })
}

export function getChat(id: string) {
    return {
        chat: get(chatsStore).find(chat => chat.id === id),
        index: get(chatsStore).findIndex(chat => chat.id === id)
    };
}