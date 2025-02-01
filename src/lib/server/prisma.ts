import { PrismaClient, type Vote } from "@prisma/client";
import { writeFile } from "fs/promises";
import { logger } from "./logger";

// Prisma singleton
const prisma = new PrismaClient();

export { prisma };


// export a csv a contigency table with users as label and vote as value
(async () => {
    const users = await prisma.user.findMany();
    const votes = await prisma.vote.findMany();

    const voteMap = new Map();

    votes.forEach(vote => {
        const key = `${vote.sourceId}-${vote.targetId}`;
        voteMap.set(key, vote);
    });

    const generateCsv = (getValue: (vote: Vote) => string) => {
        const headers = [""].concat(users.map(user => user.displayName));
        const table = users.map(rowUser => [
            rowUser.displayName,
            ...users.map(colUser => {
                const key = `${rowUser.id}-${colUser.id}`;
                return voteMap.has(key) ? getValue(voteMap.get(key)) : "";
            })
        ]);
        return [headers, ...table].map(row => row.join(",")).join("\n");
    };

    const csvVote = generateCsv(vote => vote.vote);
    const csvTime = generateCsv(vote => String(vote.time));
    const csvTimesChanged = generateCsv(vote => String(vote.timesChanged));

    await Promise.all([
        writeFile("logs/votes.csv", csvVote),
        writeFile("logs/times.csv", csvTime),
        writeFile("logs/timesChanged.csv", csvTimesChanged)
    ]);

    logger.info("CSV files written successfully", { csvVote, csvTime, csvTimesChanged });
})();
