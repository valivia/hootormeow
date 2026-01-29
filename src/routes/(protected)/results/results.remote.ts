import { query } from "$app/server";
import { error } from "@sveltejs/kit";
import { prisma } from "lib/server/prisma";
import { ensureLoggedIn } from "lib/server/session";
import { NEGATIVE_VOTER_DEBUFF, NEGATIVE_VOTER_DEBUFF_THRESHOLD, VOTE_COMPLETE_BONUS, voteScore } from "lib/server/voteScore";
import { canViewResults, isAdmin, safeUserOmit, type UserWithVotes } from "lib/user";
import { VoteKey } from "lib/vote";

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
            votesReceived: {
                where: {
                    source: { hasFinishedSetup: true }
                }
            },
            votesCasted: {
                where: {
                    target: { hasFinishedSetup: true }
                }
            }
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
            // Calculate votes
            const votes = user.votesReceived.reduce((acc, vote) => {
                const key = vote.vote as VoteKey;
                acc[key]++;
                acc.total += voteScore[key];
                return acc;
            }, {
                favourite: 0,
                smash: 0,
                pass: 0,
                total: 0,
            } as UserWithVotes["votes"]);

            // Bonus point for voting for everyone
            if (user.votesCasted.length === data.length - 1)
                votes.total += VOTE_COMPLETE_BONUS;

            // Debuff for downvoting excessively
            const passRatio = user.votesCasted.filter(vote => vote.vote === VoteKey.pass).length / user.votesCasted.length;
            if (passRatio >= NEGATIVE_VOTER_DEBUFF_THRESHOLD) {
                votes.total -= NEGATIVE_VOTER_DEBUFF;
            }

            votes.total = Math.round(votes.total);

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
