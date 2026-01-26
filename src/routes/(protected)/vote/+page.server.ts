import { prisma } from "lib/server/prisma";
import type { PageServerLoad } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { ensureLoggedIn } from "lib/server/session";
import { canVote, safeUserOmit } from "lib/user";
import { shuffle } from "lib/shuffle";

export const load = (async () => {
    const user = await ensureLoggedIn();

    if (!canVote(user)) {
        return redirect(302, "/");
    }

    let users = await prisma.user.findMany({
        include: {
            votesReceived: {
                select: { vote: true, targetId: true },
                where: { sourceId: user.id },
            }
        },
        omit: safeUserOmit,
        where: {
            id: { not: user.id },
            hasFinishedSetup: true,
        },
    });

    type User = typeof users[0];
    interface VoteUser extends Omit<User, "votesReceived"> {
        vote: string | null;
    }

    // Randomize order to prevent bias
    shuffle(users, user.id);

    const candidates: VoteUser[] = users
        .map((user) => {
            return {
                ...user,
                votesReceived: undefined,
                vote: user.votesReceived[0]?.vote ?? null,
            };
        })
        // Sort so all users with no vote are at the top
        .sort((a, b) =>
            a.vote === null ? 1 : b.vote === null ? -1 : 0
        );

    return { candidates };
}) satisfies PageServerLoad;
