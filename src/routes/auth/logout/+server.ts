import { redirect, type RequestHandler } from "@sveltejs/kit";
import { logger } from "lib/server/logger";
import { ensureLoggedIn } from "lib/server/session";

export const GET: RequestHandler = async ({ cookies }) => {
    const user = await ensureLoggedIn(cookies);
    cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
    logger.info(`Logged out user ${user.displayName}`, { user });
    redirect(302, "/");
};
