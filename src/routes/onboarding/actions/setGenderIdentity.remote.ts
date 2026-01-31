import * as v from "valibot";
import { form } from "$app/server";
import { ensureLoggedIn, ensureUserCanAccessSetup } from "lib/server/session";
import { prisma } from "lib/server/prisma";
import { logger } from "lib/server/logger";
import { getPronouns } from "lib/user";

export const setGenderIdentity = form(
    v.object({
        isMasc: v.optional(v.boolean(), false),
        isFem: v.optional(v.boolean(), false),
        isEnby: v.optional(v.boolean(), false),
    }),
    async ({ isMasc, isFem, isEnby }) => {
        let user = await ensureLoggedIn();
        ensureUserCanAccessSetup(user);

        user = await prisma.user.update({
            where: { id: user.id },
            data: { isMasc, isFem, isEnby },
        })

        logger.info(`⚧️  ${user.displayName} (${user.id}) has set their gender identity. ${getPronouns(user)}`);

        return user;
    });
