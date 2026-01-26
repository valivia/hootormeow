import { form } from "$app/server";
import { error, redirect } from "@sveltejs/kit";
import { logger } from "lib/server/logger";
import { prisma } from "lib/server/prisma";
import { ensureLoggedIn, ensureUserCanAccessSetup } from "lib/server/session";
import { hasFinishedSetup } from "lib/user";

export const completeSetup = form(async () => {
    let user = await ensureLoggedIn();
    ensureUserCanAccessSetup(user);

    if (!hasFinishedSetup(user)) {
        return error(400, "Not all setup steps completed");
    }

    user = await prisma.user.update({
        where: { id: user.id },
        data: {
            hasFinishedSetup: true,
            allowSetupOverride: false,
        },
    })

    logger.info(`✅ ${user.displayName} has completed onboarding`);

    return redirect(303, "/");
});
