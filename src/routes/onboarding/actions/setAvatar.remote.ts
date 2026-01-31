import * as v from "valibot";
import { form } from "$app/server";
import { ensureLoggedIn, ensureUserCanAccessSetup } from "lib/server/session";
import { error } from "@sveltejs/kit";
import { Avatar } from "lib/server/avatar";
import { logger } from "lib/server/logger";

export const setAvatar = form(
    v.object({
        avatar: v.file(),
    }),
    async (data) => {
        let user = await ensureLoggedIn();
        ensureUserCanAccessSetup(user);

        // Read the file
        const file = await data.avatar.arrayBuffer();

        let avatar: Avatar;
        try {
            avatar = await Avatar.loadImage(file);
        } catch (e) {
            return error(400, { message: "Failed to load image" });
        }

        // Handle errors if any
        try {
            user = await avatar.save(user.id);
        } catch (err) {
            return error(500, { message: "Failed to process image" });
        }

        logger.info(`🖼️  ${user.displayName} has set a custom avatar`);

        return user;
    });
