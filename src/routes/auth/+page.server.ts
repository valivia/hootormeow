import { loggedInUser } from "lib/server/session";
import type { PageServerLoad } from "./$types";

export const load = (async ({ cookies }) => {
    const user = await loggedInUser(cookies);

    return { user };
}) satisfies PageServerLoad;
