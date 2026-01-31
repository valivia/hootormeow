<script lang="ts">
    import { page } from "$app/state";
    import { IHeart, IResult, IUser } from "lib/icons";
    import { canViewResults, canVote } from "lib/user.js";

    let { data, children } = $props();
</script>

<nav>
    <a href="/" aria-current={page.url.pathname === "/"}><IUser /> <span>Profile</span></a>
    <a href="/vote" aria-current={page.url.pathname === "/vote"} aria-disabled={!canVote(data.user)}>
        <IHeart /> <span>Voting</span>
    </a>
    <a href="/results" aria-current={page.url.pathname === "/results"} aria-disabled={!canViewResults(data.user)}>
        <IResult /> <span>Results</span>
    </a>
</nav>

{@render children()}

<style lang="scss">
    $avatarSize: 4rem;

    nav {
        z-index: 10;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4rem;

        border-top-left-radius: var(--border-radius);
        border-top-right-radius: var(--border-radius);
        background-color: var(--theme-secondary);
        display: flex;
        align-items: center;
        justify-content: space-around;

        a {
            color: var(--theme-text);
            text-decoration: none;
            font-size: 1.5rem;

            span {
                display: none;
            }
        }

        a[aria-current="true"] {
            color: var(--theme-accent);
            cursor: default;
        }
    }

    // Landscape
    @media (orientation: landscape) {
        nav {
            bottom: 1rem;
            left: 50%;
            transform: translateX(-50%);
            height: min-content;
            width: min-content;

            flex-direction: row;
            justify-content: flex-start;

            border-radius: var(--border-radius);
            overflow: hidden;

            a {
                display: inline-flex;
                align-items: center;
                justify-content: flex-start;
                width: 100%;
                gap: 0.5rem;

                font-size: 1rem;
                padding-inline: 1.4rem;
                padding-block: 0.5rem;

                &:hover {
                    background-color: var(--theme-accent-hover);
                }

                span {
                    display: inline;
                    font-size: 1.3em;
                }

                &[aria-current="true"] {
                    color: inherit;
                    background-color: var(--theme-accent-active);
                }
            }
        }
    }
</style>
