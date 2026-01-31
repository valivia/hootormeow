<script lang="ts">
    import type { ClientUser } from "lib/user";
    import Button from "components/Button.svelte";

    interface Props {
        user: ClientUser;
        stage: number;
    }

    let { user, stage = $bindable() }: Props = $props();
</script>

<header>
    <h1>Welcome {user.displayName}!</h1>
    <p>Let's get started by setting up your profile.</p>
</header>

<main class="content">
    <p>
        You will be guided through a few simple steps to complete your profile setup. You can get back to this anytime
        you want until voting starts.
    </p>
</main>

<nav class="navigation">
    <Button variant="primary" color="var(--theme-accent)" onclick={() => (stage += 1)}>Get Started</Button>
</nav>

<style lang="scss">
    @use "./shared.scss";

    header {
        height: unset;
        margin-top: 30dvh;
    }

    main {
        height: unset;
    }

    p {
        text-align: center;
    }
</style>
