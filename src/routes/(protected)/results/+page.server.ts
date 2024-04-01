import { prisma } from "lib/server/prisma";
import type { PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { safeUserSelect } from "lib/user";
import { ensureLoggedIn } from "lib/server/session";
import { PUBLIC_ALLOW_VOTING } from "$env/static/public";

export const load = (async ({ cookies }) => {
    await ensureLoggedIn(cookies);

    if (PUBLIC_ALLOW_VOTING !== "true") {
        error(403, { message: "Voting is currently disabled, please add a picture in the meantime!" });
    }


    const data = await prisma.user.findMany({
        select: {
            ...safeUserSelect,
            votesReceived: true,
            votesCasted: true
        }
    });

    const users = data.filter((user) => user.votesReceived.length !== 0);

    if (users.length <= 0) {
        fail(404);
    }

    return { users }
}) satisfies PageServerLoad;
