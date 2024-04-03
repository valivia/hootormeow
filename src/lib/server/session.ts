import { type Cookies, redirect } from "@sveltejs/kit";
import { prisma } from "./prisma";

import type { ClientUser } from "lib/user";

export async function loggedInUser(cookies: Cookies): Promise<ClientUser | null> {
    const token = cookies.get("sessionToken");
    if (!token) return null;

    return await prisma.user.findUnique({
        where: { token },
    });
}

export async function ensureLoggedIn(cookies: Cookies): Promise<ClientUser> {
    const user = await loggedInUser(cookies);
    if (!user) {
        cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
        redirect(302, "/auth");
    }
    return user;
}
