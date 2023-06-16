import { prisma } from "$lib/db";

export default class ServerChat {

    private constructor() { }

    public static async create(message: string, ownerUsername: string, roomName: string, createdAt = Date.now(), id?: string) {

        return await prisma.chat.create({
            data: {
                id,
                content: message,
                owner: {
                    connect: {
                        username: ownerUsername
                    },
                },
                room: {
                    connect: {
                        name: roomName
                    }
                },
                createdAt: new Date(createdAt),
            },
            include: {
                owner: true,
                room: true
            }
        })

    }

}