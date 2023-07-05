import { INITIAL_WALLET_BALANCE, REGEX } from "$lib/const";
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

    public static async getWalletByUserId(ownerId: string) {
        let wallet = await prisma.wallet.findFirst({
            where: {
                ownerId: ownerId
            }
        })

        return wallet;
    }

    public static async createWallet(ownerId: string) {
        let wallet = await prisma.wallet.create({
            data: {
                owner: {
                    connect: {
                        id: ownerId
                    }
                },
                balance: INITIAL_WALLET_BALANCE
            }
        })

        return wallet;
    }

    public static hasEnoughCoins(balance: number, cost: number) {
        return balance >= cost ? true : false;
    }

    public static async changeWalletBalance(ownerId: string, amount: number) {
        return prisma.wallet.update({
            where: {
                ownerId: ownerId
            },
            data: {
                balance: {
                    increment: amount
                }
            }
        })
    }

    public static async getRooms(ownerId: string) {
        return prisma.room.findMany({
            where: {
                ownerId: ownerId
            }
        })
    }

    public static async getBasicByUsername(username: string) {
        return prisma.user.findFirst({
            where: {
                username
            },
        })
    }

}

export default ServerUser;