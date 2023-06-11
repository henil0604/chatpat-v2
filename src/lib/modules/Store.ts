import { userWalletBalance } from "$lib/store";
import { trpc } from "$trpc/client";

export default class Store {

    private constructor() { }

    public static async refetchUserWalletBalance() {
        const balance = await trpc().user.getUserWalletBalance.query();
        userWalletBalance.set(balance);
        return balance;
    }

}