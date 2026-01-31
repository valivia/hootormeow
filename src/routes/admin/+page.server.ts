import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";
import { prisma } from "lib/server/prisma";

export const load = (async () => {
    await ensureLoggedIn(true);

    const users = await prisma.user.findMany({
        omit: { token: true },
        orderBy: { displayName: "asc" },
    })

    return { users };
}) satisfies PageServerLoad;
