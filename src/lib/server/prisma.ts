import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import { logger } from "./logger";

// Prisma singleton
const prisma = new PrismaClient();

export { prisma };



// export a csv a contigency table with users as label and vote as value
(async () => {
    const users = await prisma.user.findMany();
    const votes = await prisma.vote.findMany();

    const table: string[][] = [];

    table.push([""].concat(users.map(user => user.displayName)));
    for (let i = 0; i < users.length; i++) {
        const row: string[] = [users[i].displayName];
        const rowUser = users[i];
        for (let j = 0; j < users.length; j++) {
            const colUser = users[j];
            const vote = votes.find(vote => vote.sourceId === rowUser.id && vote.targetId === colUser.id);
            row.push(vote ? vote.vote : "");
        }
        table.push(row);
    }

    const csv = table.map(row => row.join(",")).join("\n");


    logger.info("Writing table to logs/table.csv", { table: csv });

    await writeFile("logs/table.csv", csv);

})();