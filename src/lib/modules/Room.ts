import { getChat, type chat, addChat, chatsMetaStore, roomStore, recentAlert } from "$lib/store/room";
import { get } from 'svelte/store'
import System from "./System";
import { userStore } from "$lib/store";
import { roomChannel } from "$lib/store/pusher";

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

        if (chat.roomId !== get(roomStore)?.id) {
            return
        }

        if (getChat(chat.id).chat) {
            chatsMetaStore.set(get(chatsMetaStore).map((e) => {
                if (e.id === chat.id) {
                    e.stored = true;
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

    public static onPresenceChannelSubscriptionSucceeded(roomName: string) {
        console.log(`Subscribed to presence channel for ${roomName}`)
    }

    public static userJoinHandler(data: any) {
        console.log("user join:", data)
        if (data.info.username === get(userStore)?.username) {
            return;
        }
        if (document.hidden) {
            System.playNotificationAudio()
        }
        recentAlert.set(`${data.info.username} Joined the room`);
    }

    public static userLeaveHandler(data: any) {
        console.log("user leave:", data)
        if (data.info.username === get(userStore)?.username) {
            return;
        }
        recentAlert.set(`${data.info.username} Left the room`);
    }

    public static onSubscriptionSucceeded(roomName: string) {
        console.log(`Subscribed to ${roomName}`);
        const user = get(userStore);

        get(roomChannel)?.trigger("client-user-join", {
            username: user?.username,
            image: user?.image,
            timestamp: Date.now()
        })

    }

    public static onDisconnect(roomName: string) {
        const user = get(userStore);

        console.log(`Disconnected from ${roomName}`)
    }

    public static showPresenceHandler(id: string) {

        const user = get(userStore);

        get(roomChannel)?.trigger(`client-i-am-present`, {
            username: user?.username,
            image: user?.image,
            presence_id: id
        });
    }



}