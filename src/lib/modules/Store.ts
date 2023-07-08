import { settingsStore, userWalletBalance } from "$lib/store";
import { trpc } from "$trpc/client";

export default class Store {

    private constructor() { }

    public static async refetchUserWalletBalance() {
        const balance = await trpc().user.getUserWalletBalance.query();
        userWalletBalance.set(balance);
        return balance;
    }

    public static async fetchServiceSettings() {
        const s = await trpc().service.getServiceSettings.query();
        settingsStore.set(s);
        return s;
    }

}