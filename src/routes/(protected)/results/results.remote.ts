import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { prisma } from "lib/server/prisma";
import { ensureLoggedIn } from "lib/server/session";
import { canViewResults, isAdmin, safeUserOmit, type UserWithVotes } from "lib/user";
import { voteType, type VoteKey } from "lib/vote";

export const getResults = query(async () => {
    const user = await ensureLoggedIn();

    if (!canViewResults(user)) {
        return error(403, "The results are currently not available.");
    }

    const userVoteCount = await prisma.vote.count({
        where: { sourceId: user.id },
    });

    const data = await prisma.user.findMany({
        include: {
            votesReceived: true,
            votesCasted: true,
        },
        omit: safeUserOmit,
        where: {
            hasFinishedSetup: true,
        }
    });

    const totalVotesCasted = data.reduce((acc, user) => acc + user.votesCasted.length, 0);

    const usersVotedCount = data.filter((user) => user.votesCasted.length).length;

    if (userVoteCount < data.length - 1 && !isAdmin(user)) {
        return error(403, "You must vote for all participants before you can view the results.");
    }

    const results: UserWithVotes[] = data
        .map((user) => {
            const votes = user.votesReceived.reduce((acc, vote) => {
                const key = vote.vote as VoteKey;
                acc[key]++;
                acc.total += voteType[key].score;
                return acc;
            }, {
                favourite: 0,
                smash: 0,
                pass: 0,
                total: 0,
            } as UserWithVotes["votes"]);

            return {
                ...user,
                votesCasted: undefined,
                votesReceived: undefined,
                votes,
            };
        })
        .sort((a, b) => b.votes.total - a.votes.total);

    return {
        results,
        usersVotedCount,
        totalVotesCasted,
        userCount: results.length,
    };
});
