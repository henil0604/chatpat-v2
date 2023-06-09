import { redirect } from '@sveltejs/kit';

export const load = async (event) => {

    const user = event.locals.user;

    // if (user?.username) {
    //     const fromUrl = (event.url.searchParams.get("redirectTo") || "");
    //     throw redirect(301, fromUrl || "/")
    // }

    return {};
};