import pusher from '$lib/modules/server/pusher.js';
import { error, json, text } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {

    const user = locals.user!;

    if (!user) {
        throw error(401, "Unauthorized");
    }

    const formData = (await request.formData());

    const socket_id = formData.get("socket_id")

    if (!socket_id) {
        throw error(401, "Unauthorized");
    }

    const authResponse = pusher.authenticateUser(socket_id as string, {
        // @ts-ignore
        id: user.id as string,
        ...user
    })

    return json(authResponse);
};