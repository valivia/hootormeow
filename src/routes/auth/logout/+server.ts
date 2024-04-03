import { redirect, type RequestHandler } from "@sveltejs/kit";
import { logger } from "lib/server/logger";
import { ensureLoggedIn } from "lib/server/session";

export const GET: RequestHandler = async ({ request, cookies }) => {
    const user = await ensureLoggedIn(cookies);
    const ip = request.headers.get("cf-connecting-ip");
    cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
    logger.info(`User log out: ${user.displayName} - ${user.id} (${ip})`, { user, ip });
    redirect(302, "/");
};
