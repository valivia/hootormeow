import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";

export const load = (async () => {
    const user = await ensureLoggedIn(true);

    return { user };
}) satisfies PageServerLoad;
