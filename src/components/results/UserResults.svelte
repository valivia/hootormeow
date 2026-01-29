<script lang="ts">
    import ReceivedVotes from "./ReceivedVotes.svelte";
    import { getUserImage, type UserWithVotesDisplay } from "lib/user";
    import { crossfade } from "svelte/transition";
    import { quintOut } from "svelte/easing";
    import { flip } from "svelte/animate";
    import { VoteKey, voteType } from "lib/vote";

    export const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 200),

        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === "none" ? "" : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`,
            };
        },
    });

    interface Props {
        users: UserWithVotesDisplay[];
    }

    let { users }: Props = $props();
</script>

<ol>
    {#each users as user (user.id + user.rank)}
        {@const src = getUserImage(user)}
        {@const { rank, isContested } = user}
        {@const totalVotes = user.votes.smash + user.votes.favourite + user.votes.pass}
        {@const scoreBalanceVotes = totalVotes == 0 ? 50 : ((totalVotes - user.votes.pass) / totalVotes) * 100}
        <li
            data-rank={rank}
            style={`--score-balance-votes: ${scoreBalanceVotes}%;`}
            animate:flip={{ duration: 200 }}
            in:receive={{ key: user.id }}
            out:send={{ key: user.id }}
        >
            <img {src} alt="avatar" />
            <div class="score"></div>
            <div class="info">
                <h3><span>{rank}.</span> {user.displayName}</h3>
                <ReceivedVotes {user} />
            </div>
            <span class="total" class:isContested>{Math.max(user.votes.total, 0)}</span>
        </li>
    {/each}
</ol>

<style lang="scss">
    @use "styles/utils.scss" as *;

    ol {
        list-style: none;
        padding-block: 1rem;
    }

    li {
        display: grid;
        grid-template-columns: auto 4px 1fr auto;
        grid-template-rows: clamp(5rem, 10vw, 8rem);
        grid-template-areas: "avatar score info total";
        column-gap: 0.5rem;

        margin-bottom: 1.6rem;

        border-radius: var(--border-radius);

        --mixed: color-mix(in oklab, var(--vote-smash) var(--score-balance-votes), var(--vote-pass));
        background-color: oklch(from var(--mixed) 90% 4% h);
        box-shadow: -2px 6px 9px -5px oklch(from var(--mixed) 80% 10% h);

        img {
            grid-area: avatar;
            margin-block: -0.5rem;
            margin-inline-start: -4px;
            height: calc(100% + 1rem);
            aspect-ratio: 4 / 5;
            border-radius: var(--border-radius);

            border: 2px solid transparent;
        }
        // Not using nth-child because of the possibility of contested ranks
        &[data-rank="1"] > img {
            border-color: oklch(from var(--theme-accent) l 40% h);
        }

        &[data-rank="2"] > img {
            border-color: oklch(from var(--theme-accent) l 30% h);
        }

        &[data-rank="3"] > img {
            border-color: oklch(from var(--theme-accent) l 20% h);
        }
    }

    :global([data-theme="dark"]) li {
        background-color: oklch(from var(--mixed) 25% 10% h);
        box-shadow: -2px 6px 9px -5px oklch(from var(--mixed) 10% 15% h);
    }

    .score {
        grid-area: score;
        align-self: center;
        height: 80%;
        width: 4px;
        border-radius: 100vw;
        background-color: red;
        background: linear-gradient(
            to top,
            var(--vote-smash) max(0%, calc(var(--score-balance-votes) - 15%)),
            var(--vote-pass) min(100%, calc(var(--score-balance-votes) + 15%))
        );
    }

    .isContested {
        text-decoration: underline;
        text-decoration-color: var(--theme-accent);
    }

    .info {
        grid-area: info;
        padding-block: 0.8rem clamp(0.5rem, 1.5vw, 1rem);
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        h3 {
            grid-area: title;
            font-size: clamp(1rem, 3vw, 1.2rem);

            & span {
                color: oklch(from var(--theme-text) 60% c h);
                font-size: 0.8em;
            }
        }
    }

    .total {
        grid-area: total;
        align-self: center;
        font-size: 1.2rem;
        padding-right: 1.5rem;
    }
</style>
