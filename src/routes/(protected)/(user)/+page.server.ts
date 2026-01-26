import { prisma } from "lib/server/prisma";
import type { PageServerLoad } from "./$types";
import { ensureLoggedIn } from "lib/server/session";

export const load = (async () => {
    const user = await ensureLoggedIn();

    const voteCount = await prisma.vote.count({
        where: { sourceId: user.id },
    });

    return { voteCount }
}) satisfies PageServerLoad;
