import { redirect, type Cookies } from "@sveltejs/kit";
import { prisma } from "./prisma";

import type { ClientUser } from "lib/user";

export async function loggedInUser(cookies: Cookies): Promise<ClientUser | null> {
    const token = cookies.get("sessionToken");
    if (!token) return null;

    const user = await prisma.user.findUnique({
        where: { token },
    });

    return user;
}

export async function ensureLoggedIn(cookies: Cookies): Promise<ClientUser> {
    const user = await loggedInUser(cookies);
    if (!user) redirect(302, "/auth");
    return user;
}
