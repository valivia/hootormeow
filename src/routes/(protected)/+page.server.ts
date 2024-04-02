import type { PageServerLoad } from "../auth/$types";
import { prisma } from "lib/server/prisma";

export const load = (async () => {
    const userCount = await prisma.user.count({});

    return { userCount };
}) satisfies PageServerLoad;
