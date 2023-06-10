import { REGEX } from "$lib/const";
import { prisma } from "$lib/db";

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

}