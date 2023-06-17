import { getChat, type chat, addChat, chatsMetaStore } from "$lib/store/room";
import { get } from 'svelte/store'
import System from "./System";

export default class ClientRoom {
    private constructor() { }

    public static newChatHandler(data: any) {
        console.log("data?", data);
        if (!data.id) {
            console.error(data);
            return;
        }


        const chat: chat = data;

        console.log(
            chat.id,
            Date.now() - new Date(chat.createdAt).getTime()
        );

        if (getChat(chat.id).chat) {
            chatsMetaStore.set(get(chatsMetaStore).map((e) => {
                if (e.id === chat.id) {
                    e.sending = false;
                };
                return e;
            }));
            return;
        }

        if (document.hidden) {
            System.playNotificationAudio()
        }

        addChat({
            ...chat,
        });

    }

}