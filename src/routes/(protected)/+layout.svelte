<script lang="ts">
    import { getUserImage } from "lib/user";
    import { page } from "$app/state";
    import { ILogOut } from "lib/icons";

    let { data, children } = $props();

    let { user } = data;
</script>

<nav>
    <a href="/" aria-current={page.url.pathname === "/"}> Home </a>
    <a href="/vote" aria-current={page.url.pathname === "/vote"}> Vote </a>
    <a href="/results" aria-current={page.url.pathname === "/results"}> Results </a>
    <div class="spacer"></div>
    <a
        href="/auth/logout"
        class="logout"
        onclick={(e) => confirm("Are you sure you want to log out?") || e.preventDefault()}
    >
        <ILogOut />
    </a>
    <a href="/configure" aria-current={page.url.pathname === "/configure"}>
        <img src={getUserImage($user)} alt="User Avatar" />
    </a>
</nav>

<main>
    {@render children()}
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
            text-decoration: none;
            font-size: clamp(1rem, 2vw, 1.3rem);

            &:not(:last-child) {
                padding: 0.5rem;
            }
        }

        a[aria-current="true"] {
            color: var(--theme-accent);
            text-decoration: underline;
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
