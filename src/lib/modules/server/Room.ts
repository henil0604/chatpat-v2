import { REGEX } from "$lib/const";
import { prisma } from "$lib/db";
import System from "../System";

export default class ServerRoom {

    private constructor() { }


    public static async isRoomnameValid(roomName: string) {

        if (roomName.trim() === "") {
            return {
                valid: false,
                message: "Roomname must not be empty"
            };
        }

        if (REGEX.alphanumeric.test(roomName) === false) {
            return {
                valid: false,
                message: "Roomname should only contain a-z, A-Z, 0-9, Underscore(_), dot(.) and dash(-)"
            }
        }

        const room = await prisma.room.findFirst({
            where: {
                name: roomName
            }
        })

        return room ? {
            valid: false,
            message: "Roomname is taken"
        } : {
            valid: true,
            message: "Roomname is valid"
        }
    }

    public static async createRoom(ownerId: string, roomName: string, visibility: string, password?: string) {
        password = visibility === 'private' ? System.hash(password as string) : undefined;

        const room = prisma.room.create({
            data: {
                name: roomName,
                visibility,
                password,
                owner: {
                    connect: {
                        id: ownerId
                    }
                }
            }
        })

        return room;
    }


}