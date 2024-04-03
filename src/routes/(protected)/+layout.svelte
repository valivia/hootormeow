<script lang="ts">
    import { getUserImage } from "lib/user";
    import type { PageData } from "./$types";
    import { page } from "$app/stores";
    import { LogOutIcon } from "svelte-feather-icons";

    export let data: PageData;
    let { user } = data;

    $: src = getUserImage($user);
</script>

<nav>
    <a href="/" aria-current={$page.url.pathname === "/"}> Home </a>
    <a href="/vote" aria-current={$page.url.pathname === "/vote"}> Vote </a>
    <a href="/results" aria-current={$page.url.pathname === "/results"}>
        Results
    </a>
    <div class="spacer"></div>
    <a href="/auth/logout" class="logout">
        <LogOutIcon />
    </a>
    <a href="/configure" aria-current={$page.url.pathname === "/configure"}>
        <img {src} alt="User Avatar" />
    </a>
</nav>

<main>
    <slot />
</main>

<style lang="scss">
    $avatarSize: 4rem;

    .logout {
        margin-left: auto;
        margin-right: 1rem;
        font-size: 0.95em;
        color: var(--theme-danger);
    }

    nav {
        display: flex;
        align-items: center;

        img {
            width: $avatarSize;
            height: $avatarSize;
            border-radius: 100vw;
            border: 2px solid currentColor;
        }

        a {
            color: var(--theme-text);
            text-decoration: underline;
            font-size: clamp(1rem, 2vw, 1.3rem);

            &:not(:last-child) {
                padding: 0.5rem 1rem;
            }
        }

        a[aria-current="true"] {
            color: var(--theme-accent);
            cursor: default;
        }
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding-block: 3rem;
    }
</style>
