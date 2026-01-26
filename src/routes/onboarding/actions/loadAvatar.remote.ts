import { command } from "$app/server";
import { error } from "@sveltejs/kit";
import { Avatar } from "lib/server/avatar";
import { logger } from "lib/server/logger";
import { ensureLoggedIn, ensureUserCanAccessSetup } from "lib/server/session";

export const loadAvatar = command(async () => {
    let user = await ensureLoggedIn();
    ensureUserCanAccessSetup(user);

    const response = await fetch(`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096`);

    if (!response.ok) {
        return error(500, { message: "Failed to fetch avatar from Discord" });
    }

    // Read the file
    const file = await response.arrayBuffer();

    let avatar: Avatar;
    try {
        avatar = await Avatar.loadImage(file);
    } catch (e) {
        return error(400, { message: "Failed to load image" });
    }

    // Handle errors if any
    try {
        user = await avatar.save(user.id, true);
    } catch (err) {
        return error(500, { message: "Failed to process image" });
    }

    logger.info(`🖼️  ${user.displayName} has loaded in their Discord avatar`);

    return { user };
});
