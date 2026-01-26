import * as v from "valibot";
import { command } from "$app/server";
import { prisma } from "lib/server/prisma";
import { logger } from "lib/server/logger";
import { fail } from "@sveltejs/kit";
import { Avatar } from "lib/server/avatar";
import { ensureLoggedIn } from "lib/server/session";
import { error } from "console";

export const deleteUser = command(
    v.string(),
    async (id) => {
        ensureLoggedIn(true);

        try {
            const deletedUser = await prisma.user.delete({
                where: { id }
            });

            if (!deletedUser) {
                return error(404, { message: "User not found" });
            }

            if (deletedUser.uploadedAt)
                await Avatar.delete(id);

            logger.info(`🛠️  Deleted user ${deletedUser.displayName} (${deletedUser.id})`);
        } catch (e) {
            logger.error("Failed to delete user", { e });
            return fail(500, { message: "Failed to delete user" });
        }
        return;
    });
