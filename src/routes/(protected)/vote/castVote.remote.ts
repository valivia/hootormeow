import * as v from "valibot";
import { command } from "$app/server";
import { VoteKey, voteType } from "lib/vote";
import { logger } from "lib/server/logger";
import { prisma } from "lib/server/prisma";
import { ensureLoggedIn } from "lib/server/session";
import { liveUpdate } from "lib/server/sse";
import { error } from "@sveltejs/kit";
import { writeStatistics } from "lib/server/statistics";
import { canVote } from "lib/user";

export const addVote = command(
    v.object({
        vote: v.picklist(Object.keys(voteType)),
        time: v.optional(v.number()),
        targetId: v.string(),
    }),
    async ({ vote, time, targetId }) => {
        const user = await ensureLoggedIn();

        const sourceId = user.id;

        if (!canVote(user)) {
            throw error(403, "Voting is currently closed.");
        }

        // Prevent voting for yourself
        if (sourceId === targetId) {
            throw error(400, "You cannot vote for yourself.");
        }

        const previousVotes = await prisma.vote.findMany({
            where: { sourceId: user.id },
        });

        // Prevent more than 1 favourite vote
        if (previousVotes.some(v => v.vote === VoteKey.favourite) && vote === VoteKey.favourite) {
            throw error(400, "You have already used your favourite vote.");
        }

        // Prevent duplicate votes
        const currentVoteOnTarget = previousVotes.find(v => v.targetId === targetId);
        if (currentVoteOnTarget && currentVoteOnTarget.vote === vote) return;

        const result = await prisma.vote.upsert({
            where: { sourceId_targetId: { sourceId, targetId } },
            create: {
                vote, source: { connect: { id: sourceId } },
                time: previousVotes.some(v => v.targetId === targetId) ? undefined : time,
                target: { connect: { id: targetId } },
            },
            update: { vote, timesChanged: { increment: 1 } },
            include: { source: true, target: true }
        });

        const userCount = await prisma.user.count({ where: { hasFinishedSetup: true } });
        const votes = await prisma.vote.findMany({
            where: { sourceId: user.id },
        });

        // Notify when results when all votes are in
        if (votes.length >= userCount - 1) {
            liveUpdate.broadcast("results-updated");

            setImmediate(() => {
                writeStatistics().catch(err => {
                    logger.error("Failed to write statistics", err);
                });
            });
        }

        logger.info(`🗳️  ${result.source.displayName} voted ${vote} on ${result.target.displayName} in ${time}ms`, { vote: result });

        return;
    });
