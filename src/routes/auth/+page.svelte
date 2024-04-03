<script lang="ts">
    import { DISCORD_AUTHORIZE_URL } from "lib/auth";
    import type { PageData } from "./$types";

    import {
        PUBLIC_DISCORD_CLIENT_ID,
        PUBLIC_DISCORD_REDIRECT_URI,
    } from "$env/static/public";

    export let data: PageData;
    let { user } = data;

    const queryParams = new URLSearchParams({
        client_id: PUBLIC_DISCORD_CLIENT_ID,
        response_type: "code",
        scope: "identify",
        prompt: "none",
        redirect_uri: PUBLIC_DISCORD_REDIRECT_URI,
    });
    const finalUrl = `${DISCORD_AUTHORIZE_URL}?${queryParams.toString()}`;
</script>

{#if user}
    <h1>Welcome back, {user.displayName}!</h1>
    <p>You are now logged in.</p>
    <a href="/">Go back</a>
{:else}
    <h1>Log in to continue</h1>
    <a href={finalUrl}>Log in</a>
{/if}
