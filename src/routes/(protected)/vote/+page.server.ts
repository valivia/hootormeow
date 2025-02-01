import { prisma } from "lib/server/prisma";
import type { PageServerLoad } from "./$types";
import { error, fail } from "@sveltejs/kit";
import y from "yup";
import { parseData } from "lib/server/dataParser";
import { VoteType } from "lib/vote";
import { ensureLoggedIn } from "lib/server/session";
import { logger } from "lib/server/logger";
import { safeUserSelect } from "lib/user";
import { PUBLIC_ALLOW_VOTING, PUBLIC_OWNER_ID } from "$env/static/public";

export const load = (async ({ cookies }) => {
    const session = await ensureLoggedIn(cookies);

    if (PUBLIC_ALLOW_VOTING !== "true" && PUBLIC_OWNER_ID !== session.id) {
        error(403, { message: "Voting is currently disabled, please add a picture in the meantime!" });
    }

    const users = await prisma.user.findMany({
        select: {
            ...safeUserSelect,
            votesReceived: {
                select: { vote: true, targetId: true },
                where: { sourceId: session.id },
            }
        },
        where: {
            id: { not: session.id },
            OR: [
                { isFeminine: true },
                { isMasculine: true },
            ],
        },
        orderBy: { displayName: "asc" }
    });

    type User = typeof users[0];
    interface VoteUser extends Omit<User, "votesReceived"> {
        vote: string | null;
    }

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

    if (candidates.length === 0) {
        return error(404, "No candidates found");
    }

    if (!session.isFeminine && !session.isMasculine) {
        return error(403, "You must select atleast 1 category in the settings to vote");
    }

    return {
        candidates,
    };
}) satisfies PageServerLoad;


const schema = y.object({
    vote: y.string().oneOf(Object.keys(VoteType)).required(),
    time: y.number().optional(),
    targetId: y.string().required(),
});


export const actions = {
    async castVote({ request, cookies }) {
        const user = await ensureLoggedIn(cookies);
        const data = await parseData(request, schema);

        if ("errors" in data) {
            return fail(400, { validationError: data.errors });
        }

        const { vote, targetId } = data;
        const sourceId = user.id;

        const result = await prisma.vote.upsert({
            where: { sourceId_targetId: { sourceId, targetId } },
            create: {
                vote, source: { connect: { id: sourceId } },
                time: data.time,
                target: { connect: { id: targetId } },
            },
            update: { vote, timesChanged: { increment: 1 } },
            include: { source: true, target: true }
        });

        logger.info(`User ${result.source.displayName} voted ${vote} on ${result.target.displayName}`);

        return { vote: result };
    },
};
