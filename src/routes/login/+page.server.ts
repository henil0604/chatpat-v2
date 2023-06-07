import { redirect } from "@sveltejs/kit";

export async function load({ params, locals, url }) {
    const session = await locals.getSession();
    if (session) {
        const to = url.searchParams.get("redirectTo") || "/";
        throw redirect(301, to)
    }
    return;
}