import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "../auth/$types";
import { prisma } from "lib/server/prisma";

export const load = (async ({ cookies }) => {
    const user = await ensureLoggedIn(cookies);

    const userCount = await prisma.user.count({});


    return { user, userCount };
}) satisfies PageServerLoad;
