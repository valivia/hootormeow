import { prisma } from "lib/server/prisma";
import type { PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import { safeUserSelect, type UserWithVotes } from "lib/user";
import { ensureLoggedIn } from "lib/server/session";
import { PUBLIC_SHOW_RESULTS } from "$env/static/public";
import { VoteType, type VoteKey } from "lib/vote";

export const load = (async ({ cookies }) => {
    const session = await ensureLoggedIn(cookies);

    if (PUBLIC_SHOW_RESULTS !== "true") {
        error(403, { message: "The results are currently hidden" });
    }

    const voteCount = await prisma.vote.count({
        where: { sourceId: session.id },
    });


    const data = await prisma.user.findMany({
        select: {
            ...safeUserSelect,
            votesReceived: true,
        },
    });

    if (voteCount < data.length) {
        error(403, { message: "You haven't voted for all users yet" });
    }

    const results: UserWithVotes[] = data
        .map((user) => {
            const votes = user.votesReceived.reduce((acc, vote) => {
                const key = vote.vote as VoteKey;
                acc[key]++;
                acc.total += VoteType[key].score;
                return acc;
            }, {
                date: 0,
                smash: 0,
                maybe: 0,
                pass: 0,
                total: 0,
            } as UserWithVotes["votes"]);

            return {
                ...user,
                votes,
            };
        })
        .sort((a, b) => b.votes.total - a.votes.total);

    if (results.length <= 0) {
        fail(404);
    }

    return { results };
}) satisfies PageServerLoad;
