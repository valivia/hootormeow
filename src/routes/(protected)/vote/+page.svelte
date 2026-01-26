<script lang="ts">
    import Button from "components/Button.svelte";
    import { VoteKey, voteType, type VoteType } from "lib/vote";
    import Anchor from "components/Anchor.svelte";
    import { addVote } from "./castVote.remote";
    import Profile from "components/Profile.svelte";
    import Progress from "components/Progress.svelte";
    import { fly } from "svelte/transition";
    import { canViewResults } from "lib/user";

    let { data } = $props();
    let candidates = $state(data.candidates);

    let currentUserIndex = $state(
        candidates.findIndex((c) => c.vote === null) > -1
            ? candidates.findIndex((c) => c.vote === null)
            : candidates.length - 1,
    );

    let currentUser = $derived(candidates[currentUserIndex]);

    let voteCount = $derived(candidates.filter((c) => c.vote !== null).length);

    let progress = $derived((voteCount / candidates.length) * 100);

    let favouriteUsed = $derived(candidates.some((c) => c.vote === VoteKey.favourite));

    let startTime = $state(new Date());

    function changeIndex(change: number) {
        const newIndex = currentUserIndex + change;
        if (newIndex < 0 || newIndex >= candidates.length) return;
        else currentUserIndex = newIndex;
        startTime = new Date();
    }

    async function castVote(vote: VoteKey) {
        try {
            const result = await addVote({
                time: Date.now() - startTime.getTime(),
                targetId: currentUser.id,
                vote,
            });
            candidates[currentUserIndex].vote = vote;
            if (voteCount === candidates.length) return;
            changeIndex(1);
        } catch (error) {
            console.error("Vote submission failed", error);
            alert("There was an error submitting your vote.");
        }
    }

    let loading = $state(false);
</script>

<header>
    <h1>Voting</h1>
    <span>{currentUserIndex + 1} / {candidates.length}</span>
</header>

<main>
    {#if candidates.length === 0}
        <p>No candidates available for voting at this time.</p>
    {:else}
        <!-- Profile -->
        {#key currentUser.id}
            <div in:fly={{ x: 200, duration: 200 }}>
                <Profile user={currentUser} />
            </div>
        {/key}

        <!-- progress -->
        <Progress value={progress} />

        <!-- Vote -->
        <fieldset>
            {#snippet vote(voteKey: VoteKey)}
                {#key currentUser.id + voteKey}
                    {@const vote = voteType[voteKey]}
                    {@const isCurrent = currentUser.vote === voteKey}
                    {@const Icon = vote.icon}
                    <button
                        data-vote={voteKey}
                        data-favourite-used={voteKey === VoteKey.favourite && !isCurrent && favouriteUsed}
                        class:active={isCurrent}
                        style="--color: {vote.color};"
                        disabled={isCurrent || (voteKey === VoteKey.favourite && favouriteUsed)}
                        onclick={async () => castVote(voteKey)}
                    >
                        <Icon />
                        {#if voteKey === VoteKey.favourite}
                            <span>{favouriteUsed ? "0" : "1"}/1</span>
                        {/if}
                    </button>
                {/key}
            {/snippet}

            {@render vote(VoteKey.pass)}
            {@render vote(VoteKey.favourite)}
            {@render vote(VoteKey.smash)}
        </fieldset>

        <!-- Navigation -->
        <section>
            <Button
                color="var(--theme-accent)"
                disabled={loading || currentUserIndex === 0}
                on:click={() => changeIndex(-1)}
            >
                Previous
            </Button>

            {#if currentUserIndex === candidates.length - 1}
                <Anchor
                    href="/results"
                    variant="primary"
                    color="var(--theme-accent)"
                    aria-disabled={!canViewResults(data.user) || voteCount !== candidates.length}>Results</Anchor
                >
            {:else if currentUserIndex < candidates.length - 1}
                <Button
                    variant="primary"
                    color="var(--theme-accent)"
                    disabled={loading}
                    on:click={() => changeIndex(1)}
                >
                    Next
                </Button>
            {/if}
        </section>
    {/if}
</main>

<style lang="scss">
    @use "styles/utils.scss" as *;
    header,
    main {
        width: var(--content-width);
        margin-inline: auto;
    }

    header {
        padding-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 0.5rem;

        span {
            color: oklch(from var(--theme-text) 50% c h);
        }
    }

    section {
        display: flex;
        gap: 1rem;
        margin-block: 1.5rem;
    }

    fieldset {
        display: flex;
        grid-template-columns: 2fr 1fr 2fr;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-block: 1.5rem;
        padding-inline: 1rem;
    }

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
