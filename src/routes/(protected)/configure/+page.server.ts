import { fail, redirect } from "@sveltejs/kit";
import { parseData } from "lib/server/dataParser";
import { prisma } from "lib/server/prisma.js";
import { logger } from "lib/server/logger.js";
import { ensureLoggedIn } from "lib/server/session";
import type { PageServerLoad } from "./$types";
import { safeUserSelect } from "lib/user";
import { unlink } from "fs/promises";
import { MEDIA_PATH } from "$env/static/private";
import sharp from "sharp";
import y from "yup";


export const load = (async ({ cookies }) => {
    const session = await ensureLoggedIn(cookies);

    const data = await prisma.vote.count({
        where: { sourceId: session.id }
    });

    return { voteCount: data };
}) satisfies PageServerLoad;


const createSchema = y.object({
    file: y.mixed<File>().required(),
});

export const actions = {
    async resetVotes({ cookies }) {
        const session = await ensureLoggedIn(cookies);

        const user = await prisma.user.update({
            where: { id: session.id },
            data: { votesCasted: { deleteMany: { sourceId: session.id } } },
            select: safeUserSelect
        });

        logger.info(`Reset votes for user ${user.displayName}`, { user });
        return user;
    },

    async deleteAccount({ cookies }) {
        const session = await ensureLoggedIn(cookies);

        const user = await prisma.user.delete({
            where: { id: session.id },
            select: safeUserSelect
        });

        logger.info(`Deleted user ${user.displayName}`, { user });

        cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
        redirect(302, "/auth");
    },

    async upload({ request, cookies }) {
        const session = await ensureLoggedIn(cookies);
        const data = await parseData(request, createSchema);

        if ("errors" in data) {
            return fail(400, { validationError: data.errors });
        }

        // Read the file
        const file = await data.file.arrayBuffer();
        let metadata: sharp.Metadata;

        // Validate image is processable.
        try {
            metadata = await sharp(file).metadata();
        } catch (e) {
            console.error(e);
            return fail(400, { message: "Invalid image" });
        }

        if (!metadata.format || !metadata.width || !metadata.height) {
            return fail(400, { message: "Invalid image" });
        }

        // Create the asset
        const user = await prisma.user.update({
            where: { id: session.id },
            select: safeUserSelect,
            data: {
                uploadedAt: new Date(),
            }
        });

        // Handle errors if any
        const now = Date.now();
        try {
            await sharp(file)
                .jpeg({ mozjpeg: true, quality: 80 })
                .resize(640, 640)
                .toFile(`${MEDIA_PATH}/${user.id}.jpg`);
        } catch (error) {
            logger.error("Failed to process image.", { user, error });
            await prisma.user.update({ where: { id: session.id }, data: { uploadedAt: null } });
            return fail(500, { message: "Failed to process image" });
        }

        const duration = Date.now() - now;
        logger.info(`Added image to user ${user.displayName} in ${duration}ms`, { user });
        return user;
    },

    async delete({ cookies }) {
        const session = await ensureLoggedIn(cookies);

        const user = await prisma.user.update({
            where: { id: session.id },
            data: { uploadedAt: null },
            select: safeUserSelect
        });

        try {
            await unlink(`${MEDIA_PATH}/${user.id}.jpg`);
        } catch (error) {
            logger.error("Failed to delete image.", { user, error });
            return fail(500, { message: "Failed to delete image" });
        }

        logger.info(`Deleted image from user ${user.displayName}`, { user });
        return user;
    }
};
