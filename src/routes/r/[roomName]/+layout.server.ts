import ServerRoom from '$lib/modules/server/Room';

export const load = async ({ params }) => {
    const roomName = params.roomName;

    const room = await ServerRoom.getByName(roomName);

    const chats = await ServerRoom.getSortedChats(roomName);

    return {
        room,
        chats
    }
};