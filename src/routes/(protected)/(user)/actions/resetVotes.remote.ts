import { form } from "$app/server";
import { ensureLoggedIn } from "lib/server/session";
import { prisma } from "lib/server/prisma";
import { logger } from "lib/server/logger";
import { safeUserOmit } from "lib/user";
import { liveUpdate } from "lib/server/sse";

export const resetVotes = form(
    async () => {
        const session = await ensureLoggedIn();

        const user = await prisma.user.update({
            where: { id: session.id },
            data: { votesCasted: { deleteMany: { sourceId: session.id } } },
            omit: safeUserOmit
        });

        liveUpdate.broadcast("results-updated");

        logger.info(`🔄 Reset votes for user ${user.displayName}`, { user });
        return user;
    });
