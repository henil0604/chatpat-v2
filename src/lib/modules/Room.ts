import { getChat, type chat, addChat } from "$lib/store/room";

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
            return;
        }

        addChat({
            ...chat,
        });

    }

}