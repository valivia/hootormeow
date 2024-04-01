// http://localhost:5173/auth/redirect?error=access_denied&error_description=The+resource+owner+or+authorization+server+denied+the+request
// http://localhost:5173/auth/redirect?code=lbozoratio

import { redirect, type RequestHandler } from "@sveltejs/kit";
import { nanoid } from "nanoid";
import { DISCORD_TOKEN_URL, DISCORD_USER_URL } from "lib/auth";
import { prisma } from "lib/server/prisma";
import { PUBLIC_DISCORD_CLIENT_ID } from "$env/static/public";
import { DISCORD_CLIENT_SECRET } from "$env/static/private";

// amoog
export const GET: RequestHandler = async ({ url, cookies }) => {
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
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            client_id: PUBLIC_DISCORD_CLIENT_ID,
            client_secret: DISCORD_CLIENT_SECRET,
            grant_type: "authorization_code",
            redirect_uri: "http://localhost:5173/auth/redirect",
            code
        }).toString(),
    });

    const tokenJson = await tokenResponse.json();
    if (tokenJson.error)
        return new Response(`Discord returned an error: ${tokenJson.error} ${tokenJson.error_description}`);

    const userResponse = await fetch(DISCORD_USER_URL, {
        method: "get",
        headers: {
            'Authorization': `${tokenJson.token_type} ${tokenJson.access_token}`
        }
    });

    if (!userResponse.ok)
        return new Response("Failed to get user information from Discord");

    // https://discord.com/developers/docs/topics/oauth2#get-current-authorization-information
    const userJson = await userResponse.json();
    const newToken = nanoid(32);
    const user = await prisma.user.upsert({
        where: { id: userJson.user.id },
        create: {
            id: userJson.user.id,
            token: newToken,
            displayName: userJson.user.global_name,
            userName: userJson.user.username,
            avatar: userJson.user.avatar,
        },
        update: {
            displayName: userJson.user.global_name,
            userName: userJson.user.username,
            avatar: userJson.user.avatar,
        }
    });

    const tokenExpirationDate = new Date(Date.now() + (60 * 60 * 24 * 1000));
    cookies.set("sessionToken", user.token, { path: "/", expires: tokenExpirationDate });
    redirect(302, "/");
};
