import type { PageServerLoad } from "../auth/$types";
import { prisma } from "lib/server/prisma";

export const load = (async () => {

    const users = await prisma.user.findMany({
        omit: { token: true }
    })

    return { users };
}) satisfies PageServerLoad;
