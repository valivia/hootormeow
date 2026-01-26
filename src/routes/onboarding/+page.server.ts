import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";
import { error, redirect } from "@sveltejs/kit";
import { canAccessSetup, hasFinishedSetup } from "lib/user";

export const load = (async () => {
    const user = await ensureLoggedIn();

    if (!canAccessSetup(user)) {
        if (!hasFinishedSetup(user) || !user.hasFinishedSetup)
            return error(403, "Signup is currently disabled.");
        else
            return redirect(302, "/");
    }

    return { user };
}) satisfies PageServerLoad;
