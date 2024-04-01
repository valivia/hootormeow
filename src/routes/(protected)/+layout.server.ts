import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";

export const load = (async ({ cookies }) => {
    const user = await ensureLoggedIn(cookies);

    return { user }
}) satisfies PageServerLoad;
