import pusher from '$lib/modules/server/pusher.js';
import { error, json, text } from '@sveltejs/kit';

export const POST = async ({ request, locals }) => {

    const user = locals.user!;

    if (!user) {
        throw error(401, "Unauthorized");
    }

    const formData = (await request.formData());

    const socket_id = formData.get("socket_id")
    const channel_name = formData.get("channel_name")

    if (!socket_id) {
        throw error(401, "Unauthorized");
    }

    const authResponse = pusher.authorizeChannel(socket_id as string, channel_name as string);

    return json(authResponse);
};