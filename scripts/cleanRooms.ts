import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const whiteList = [];

const allRooms = await prisma.room.findMany();

let chatsDeleted = 0;

for (const room of allRooms) {
    console.log(`Gathering Chats of ${room.name}`);
    let chats = await prisma.chat.findMany({
        where: {
            roomName: room.name
        },
        include: {
            owner: true
        }
    })
    console.log(`Found ${chats.length} chats of ${room.name}`);

    for (const chat of chats) {
        await prisma.chat.delete({
            where: {
                id: chat.id
            },
        });
        console.log(`deleted ${chat.id} by ${chat.owner.username}`);
        chatsDeleted += 1;
    }

    await prisma.room.delete({
        where: {
            name: room.name
        }
    })
    console.log(`Deleted ${room.name}`);
}

console.log(`${chatsDeleted} chats deleted`)