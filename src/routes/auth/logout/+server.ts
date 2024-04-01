import { redirect, type RequestHandler } from "@sveltejs/kit";
import { ensureLoggedIn } from "lib/server/session";

export const GET: RequestHandler = async ({ cookies }) => {
    await ensureLoggedIn(cookies);
    cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
    redirect(302, "/");
};
