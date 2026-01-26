import { redirect } from "@sveltejs/kit";
import { prisma } from "./prisma";
import { canAccessSetup, safeUserOmit, type ClientUser } from "lib/user";
import { getRequestEvent } from "$app/server";
import { PUBLIC_OWNER_ID } from "$env/static/public";
import { env } from "process";

export async function loggedInUser(): Promise<ClientUser | null> {
    const { cookies } = getRequestEvent();
    const token = cookies.get("sessionToken");
    if (!token) return null;

    const user = await prisma.user.findUnique({
        where: { token },
        omit: safeUserOmit,
    });

    return user;
}

export async function ensureLoggedIn(needsAdmin = false): Promise<ClientUser> {
    const user = await loggedInUser();
    if (!user) {
        const { cookies } = getRequestEvent();
        cookies.set("sessionToken", "", { path: "/", expires: new Date(0) });
        redirect(302, "/auth");
    }

    if (needsAdmin && PUBLIC_OWNER_ID !== user.id) {
        redirect(302, "/");
    }

    return user;
}

export function ensureUserCanAccessSetup(user: ClientUser) {
    if (!canAccessSetup(user)) {
        throw redirect(302, "/");
    }
}
