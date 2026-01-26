import * as v from "valibot";
import { form } from "$app/server";
import { prisma } from "lib/server/prisma";
import { error } from "@sveltejs/kit";
import { info } from "console";
import { ensureLoggedIn } from "lib/server/session";

export const updateUser = form(
    v.object({
        id: v.string(),
        allowSetupOverride: v.optional(v.boolean(), false),
        allowSignupOverride: v.optional(v.boolean(), false),
        allowVotingOverride: v.optional(v.boolean(), false),
        displayName: v.optional(v.string()),
    }),
    async ({ id, allowSetupOverride, allowSignupOverride, allowVotingOverride, displayName }) => {
        ensureLoggedIn(true);

        let user = await prisma.user.findUnique({
            where: { id }
        });

        if (!user) {
            return error(404, "User not found");
        }

        user = await prisma.user.update({
            where: { id },
            data: {
                allowSetupOverride,
                allowSignupOverride,
                allowVotingOverride,
                displayName: displayName || user.userName,
            }
        })

        info(`🛠️ Updated user ${user.displayName} (${user.id})`);

        return user;
    });
