import { json, type RequestHandler } from "@sveltejs/kit";
import { prisma } from "lib/server/prisma";
import { safeUserSelect } from "lib/user";

export const GET: RequestHandler = async () => {
    const users = await prisma.user.findMany({
        select: {
            ...safeUserSelect,
            votesReceived: true,
            votesCasted: true
        }
    });
    return json(users);
};