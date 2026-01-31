<script lang="ts">
    import Button from "components/Button.svelte";
    import { env } from "$env/dynamic/public";
    import { ILogOut } from "lib/icons.js";
    import { deleteAccount } from "./actions/deleteAccount.remote";
    import Profile from "components/Profile.svelte";
    import { resetVotes } from "./actions/resetVotes.remote";
    import ThemeSelect from "components/ThemeSelect.svelte";
    import { canEditProfile, canVote } from "lib/user";
    import Anchor from "components/Anchor.svelte";

    let { data } = $props();
    let user = $derived(data.user);

    let loading = $state(false);
</script>

<header>
    <h1>Account</h1>
    <a
        href="/auth/logout"
        class="logout"
        onclick={(e) => confirm("Are you sure you want to log out?") || e.preventDefault()}
    >
        <ILogOut />
    </a>
</header>

<main>
    <Profile {user} />

    <section>
        <h2>App</h2>
        <ThemeSelect />
    </section>

    <section>
        <h2>Account management</h2>
        <!-- Edit profile -->
        {#if canEditProfile(user)}
            <Anchor href="/onboarding">Edit profile</Anchor>
        {/if}

        <div class="danger-zone">
            <h3>Danger zone</h3>
            <!-- Delete account -->
            <div class="buttons">
                <form {...deleteAccount}>
                    <Button
                        type="submit"
                        color="var(--theme-danger)"
                        variant="primary"
                        disabled={loading}
                        on:click={(event) =>
                            confirm(
                                `Are you sure you want to delete your account?${env.PUBLIC_ALLOW_SIGNUP !== "true" ? " sign up is currently disabled, you will NOT be able to make a new account." : ""}`,
                            ) || event.preventDefault()}
                    >
                        Delete account
                    </Button>
                </form>
                <!-- Reset votes -->
                {#if canVote(user) && data.voteCount > 0}
                    <form {...resetVotes}>
                        <Button
                            type="submit"
                            color="var(--theme-danger)"
                            disabled={loading}
                            on:click={(event) =>
                                confirm("Are you sure you want to reset your votes?") || event.preventDefault()}
                        >
                            Reset votes
                        </Button>
                    </form>
                {/if}
            </div>
        </div>
    </section>
</main>

<style lang="scss">
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 1rem;

        .logout {
            color: inherit;
            text-decoration: none;
            font-size: 1.2rem;

            &:hover,
            &:focus {
                color: var(--theme-danger);
            }
        }
    }

    header,
    main {
        width: var(--content-width);
        margin-inline: auto;
    }

    section {
        margin-top: 1rem;

        h2 {
            margin-bottom: 0.5rem;
        }
    }

    .buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .danger-zone {
        background-color: oklch(from var(--theme-danger) 0.95 0.12 h);
        padding-inline: 1rem;
        padding-block: 0.8rem 0.5rem;
        margin-block: 0.5rem;
        margin-inline: -1rem;
        border-radius: var(--border-radius);
    }

    :global([data-theme="dark"]) .danger-zone {
        background-color: oklch(from var(--theme-danger) 0.4 0.12 h);
    }
</style>
