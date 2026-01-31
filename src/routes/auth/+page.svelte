<script lang="ts">
    import { DISCORD_AUTHORIZE_URL } from "lib/auth";
    import { PUBLIC_DISCORD_CLIENT_ID, PUBLIC_DISCORD_REDIRECT_URI } from "$env/static/public";
    import Anchor from "components/Anchor.svelte";

    const queryParams = new URLSearchParams({
        client_id: PUBLIC_DISCORD_CLIENT_ID,
        response_type: "code",
        scope: "identify",
        prompt: "none",
        redirect_uri: PUBLIC_DISCORD_REDIRECT_URI,
    });

    const finalUrl = `${DISCORD_AUTHORIZE_URL}?${queryParams.toString()}`;
</script>

<main>
    <h1>Hoot Or Meow</h1>
    <p>Welcome to Hoot Or Meow! Please log in with Discord to continue.</p>
    <div>
        <Anchor href={finalUrl}>Log in</Anchor>
    </div>
</main>

<style lang="scss">
    @use "styles/info" as *;

    div {
        margin-top: 1rem;
    }
</style>
