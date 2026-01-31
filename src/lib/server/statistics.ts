import type { Vote } from "@prisma/client";
import { prisma } from "./prisma";
import { writeFile } from "fs/promises";
import { logger } from "./logger";

export async function writeStatistics() {
    const startTime = Date.now();
    const users = await prisma.user.findMany({ where: { hasFinishedSetup: true } });
    const votes = await prisma.vote.findMany({
        where: {
            source: { hasFinishedSetup: true },
            target: { hasFinishedSetup: true }
        }
    });

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

    // logger.info(`📊 CSV files written successfully (${Date.now() - startTime}ms)`, { csvVote, csvTime, csvTimesChanged });
}
