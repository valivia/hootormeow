import { loggedInUser } from "lib/server/session";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { hasFinishedSetup } from "lib/user";

export const load = (async () => {
    const user = await loggedInUser();

    if (user) {
        if (hasFinishedSetup(user) || user.hasFinishedSetup)
            return redirect(302, "/");
        else
            return redirect(302, "/onboarding");
    }

    return { user };
}) satisfies PageServerLoad;
