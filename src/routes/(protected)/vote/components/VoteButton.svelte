<script lang="ts">
    import { VoteKey, voteType } from "lib/vote";

    interface Props {
        voteKey: VoteKey;
        castVote?: (vote: VoteKey) => Promise<void>;
        currentUser: { vote: string | null };
        favouriteUsed?: boolean;
    }

    let { voteKey, castVote, currentUser, favouriteUsed = false }: Props = $props();

    const vote = $derived(voteType[voteKey]);
    const isCurrent = $derived(currentUser.vote === voteKey);
    const Icon = $derived(vote.icon);

    const disabled = $derived(isCurrent || (voteKey === VoteKey.favourite && favouriteUsed));
    const onclick = $derived(castVote ? async () => castVote(voteKey) : undefined);
</script>

<button
    data-vote={voteKey}
    data-favourite-used={voteKey === VoteKey.favourite && !isCurrent && favouriteUsed}
    class:active={isCurrent}
    style="--color: {vote.color};"
    {disabled}
    {onclick}
>
    <Icon />
    {#if voteKey === VoteKey.favourite}
        <span>{favouriteUsed ? "0" : "1"}/1</span>
    {/if}
</button>

<style lang="scss">
    button {
        color: var(--color);
        aspect-ratio: 1 /1;
        font-size: 1.5rem;
        background-color: transparent;

        border-radius: 100vw;
        border: 2px solid currentColor;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        width: 3em;

        cursor: pointer;

        & > span {
            font-size: 0.8rem;
            font-weight: 700;
        }

        &:hover {
            color: oklch(from var(--color) calc(l + 0.1) calc(c + 0.02) h);
        }

        &[data-vote="favourite"] {
            font-size: 1.2rem;

            &[data-favourite-used="true"] {
                color: oklch(from var(--color) 60% 20% h);
                cursor: default;
            }
        }

        &.active {
            background-color: var(--color);
            border-color: var(--color);
            color: var(--theme-primary);
            cursor: default;
        }

        &:focus-visible {
            outline: 2px solid var(--color);
            outline-offset: 0.3em;
        }
    }
</style>
