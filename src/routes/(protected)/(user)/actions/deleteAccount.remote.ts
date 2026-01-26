import { form, getRequestEvent } from "$app/server";
import { ensureLoggedIn } from "lib/server/session";
import { prisma } from "lib/server/prisma";
import { logger } from "lib/server/logger";
import { Avatar } from "lib/server/avatar";
import { redirect } from "@sveltejs/kit";
import { safeUserOmit } from "lib/user";
import { sse } from "lib/server/sse";

export const deleteAccount = form(
    async () => {
        const session = await ensureLoggedIn();

        // Delete the user
        const user = await prisma.user.delete({
            where: { id: session.id },
            include: {
                votesCasted: true,
                votesReceived: true,
            },
            omit: safeUserOmit
        });

        // Delete the image if it exists
        if (user.uploadedAt) {
            await Avatar.delete(user.id);
        }

        // Clear the session cookie and redirect to auth
        const { cookies } = getRequestEvent();
        cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });

        sse.broadcast("results-updated");

        logger.info(`🗑️  Deleted user ${user.displayName}`, { user });

        redirect(302, "/auth");
    });
