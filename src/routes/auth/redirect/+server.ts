// http://localhost:5173/auth/redirect?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request
// http://localhost:5173/auth/redirect?code=lbozoratio

import { redirect, type RequestHandler } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import { DISCORD_TOKEN_URL, DISCORD_USER_URL } from "lib/auth";
import { prisma } from "lib/server/prisma";
import { PUBLIC_ALLOW_SIGNUP, PUBLIC_DISCORD_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from "$env/static/public";
import { DISCORD_CLIENT_SECRET } from "$env/static/private";
import { logger } from "lib/server/logger";

export const GET: RequestHandler = async ({ url, cookies, request }) => {
    const authError = url.searchParams.get("error");
    const authErrorDescription = url.searchParams.get("error_description");

    if (authError)
        return new Response(`Discord returned an error: ${authError} ${authErrorDescription}`);

    const code = url.searchParams.get("code");
    if (!code)
        return new Response("No authorization code present in response");

    const tokenResponse = await fetch(DISCORD_TOKEN_URL, {
        method: "post",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            client_id: PUBLIC_DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: PUBLIC_DISCORD_REDIRECT_URI,
            code
        }).toString(),
    });

    const tokenJson = await tokenResponse.json();
    if (tokenJson.error)
        return new Response(`Discord returned an error: ${tokenJson.error} ${tokenJson.error_description}`);

    const userResponse = await fetch(DISCORD_USER_URL, {
        method: "get",
        headers: {
            "Authorization": `${tokenJson.token_type} ${tokenJson.access_token}`
        }
    });

    if (!userResponse.ok)
        return new Response("Failed to get user information from Discord");

    type UserJson = {
        id: string,
        username: string,
        avatar: string,
        banner: string,
        accent_color: string,
        banner_color: string,
        global_name: string,
    }
    // https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
    const responseJson = await userResponse.json();
    const userJson = responseJson.user as UserJson;
    const newToken = nanoid(32);

    if (!userJson.global_name) userJson.global_name = userJson.username;

    let user = await prisma.user.findUnique({ where: { id: userJson.id } });
    const ip = request.headers.get("cf-connecting-ip");

    if (!user) {
        if (PUBLIC_ALLOW_SIGNUP !== "true") {
            logger.info(`Sign up is disabled: ${userJson.global_name} - ${userJson.id} (${ip})`, { userJson, ip });
            return new Response("Sign up is disabled");
        }

        user = await prisma.user.create({
            data: {
                id: userJson.id,
                token: newToken,
                displayName: userJson.global_name,
                userName: userJson.username,
                avatar: userJson.avatar,
                isFeminine: false,
                isMasculine: false,
            }
        });
        logger.info(`User create: ${user.displayName} - ${userJson.id} (${ip})`, { user, ip });
    } else if (
        userJson.avatar !== user.avatar
        || userJson.global_name !== user.displayName
        || userJson.username !== user.userName
    ) {
        user = await prisma.user.update({
            where: { id: userJson.id },
            data: {
                displayName: userJson.global_name,
                userName: userJson.username,
                avatar: userJson.avatar,
            }
        });
        logger.info(`User update: ${user.displayName} - ${user.id} (${ip})`, { user, ip });
    } else {
        logger.info(`User log in: ${user.displayName} - ${user.id} (${ip})`, { user, ip });
    }

    const tokenExpirationDate = new Date(Date.now() + (60 * 60 * 24 * 1000));
    cookies.set("sessionToken", user.token, { path: "/", expires: tokenExpirationDate });
    redirect(302, "/");
};
