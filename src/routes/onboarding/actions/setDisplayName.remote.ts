import * as v from "valibot";
import { form } from "$app/server";
import { ensureLoggedIn, ensureUserCanAccessSetup } from "lib/server/session";
import { prisma } from "lib/server/prisma";
import { logger } from "lib/server/logger";

export const setDisplayName = form(
    v.object({
        displayName: v.pipe(v.string(), v.minLength(3), v.maxLength(32)),
    }),
    async ({ displayName }) => {
        let user = await ensureLoggedIn();
        ensureUserCanAccessSetup(user);

        user = await prisma.user.update({
            where: { id: user.id },
            data: { displayName },
        });

        logger.info(`📝 ${user.displayName} (${user.id}) has set their display name.`);

        return user;
    });
