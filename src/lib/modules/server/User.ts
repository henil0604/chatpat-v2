import { REGEX } from "$lib/const";
import { prisma } from "$lib/db";
import type { User } from "@prisma/client";

class ServerUser {

    private constructor() { }


    public static async isUsernameValid(username: string) {

        if (username.trim() === "") {
            return {
                valid: false,
                message: "Username must not be empty"
            };
        }

        if (REGEX.alphanumeric.test(username) === false) {
            return {
                valid: false,
                message: "Username should only contain a-z, A-Z, 0-9, Underscore(_), dot(.) and dash(-)"
            }
        }

        const user = await prisma.user.findFirst({
            where: {
                username: username
            }
        })

        return user ? {
            valid: false,
            message: "Username is taken"
        } : {
            valid: true,
            message: "Username is valid"
        }
    }

    public static async setProperty<T extends keyof User>(where: { [key: string]: any }, key: T, value: User[T]) {
        const set = await prisma.user.update({ where, data: { [key]: value } })
        return set;
    }


}

export default ServerUser;