import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";
import { redirect } from "@sveltejs/kit";
import { hasFinishedSetup } from "lib/user";

export const load = (async () => {
    const user = await ensureLoggedIn();

    if (!(hasFinishedSetup(user) && user.hasFinishedSetup)) {
        return redirect(302, "/onboarding");
    }

    return { user };
}) satisfies PageServerLoad;
