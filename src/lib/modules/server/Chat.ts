import { prisma } from "$lib/db";

export default class ServerChat {

    private constructor() { }

    public static async create(message: string, ownerUsername: string, roomName: string, createdAt = Date.now(), id?: string, replyChatId?: string) {
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
                repliedChat: replyChatId ? {
                    connect: {
                        id: replyChatId
                    }
                } : undefined
            },
            include: {
                owner: true,
                room: true
            }
        })

    }

    public static async getById(id: string) {
        return await prisma.chat.findFirst({
            where: {
                id
            },
            include: {
                owner: true,
                room: true
            }
        })
    }

    public static async deleteById(id: string) {
        return await prisma.chat.delete({
            where: {
                id
            }
        })
    }

    public static async addReaction(id: string, username: string, reaction: string) {
        return await prisma.chat.update({
            where: {
                id: id
            },
            data: {
                reactions: {
                    push: `${username}:${reaction}`
                }
            }
        })
    }

    public static async removeReaction(id: string, username: string, reaction: string) {
        const currentReactions = (await ServerChat.getById(id))?.reactions!;
        const updatedReactions = currentReactions.filter(e => {
            return e != `${username}:${reaction}`
        })
        return await prisma.chat.update({
            where: {
                id: id
            },
            data: {
                reactions: {
                    set: updatedReactions
                }
            }
        })
    }

}