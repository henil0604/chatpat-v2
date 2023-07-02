import { ADMIN_EMAILS } from '$lib/const.js';
import { error } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const user = locals.user;

    if (!user || ADMIN_EMAILS.includes(user.email || "") === false) {
        throw error(403, "Unauthorized")
    }

    return {};
};