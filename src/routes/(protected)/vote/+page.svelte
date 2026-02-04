<script lang="ts">
    import Button from "components/Button.svelte";
    import { VoteKey } from "lib/vote";
    import Anchor from "components/Anchor.svelte";
    import { addVote } from "./castVote.remote";
    import Profile from "components/Profile.svelte";
    import Progress from "components/Progress.svelte";
    import { fly } from "svelte/transition";
    import { canViewResults } from "lib/user";
    import Dialog from "./components/Dialog.svelte";
    import VoteButton from "./components/VoteButton.svelte";
    import { onMount } from "svelte";

    let { data } = $props();

    let dialog: HTMLDialogElement;

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

    onMount(() => {
        if (voteCount === 0) dialog.showModal();
    });

    function changeIndex(change: number) {
        const newIndex = currentUserIndex + change;
        if (newIndex < 0 || newIndex >= candidates.length) return;
        else currentUserIndex = newIndex;
        startTime = new Date();
    }

    async function castVote(vote: VoteKey) {
        try {
            loading = true;
            await addVote({
                time: Date.now() - startTime.getTime(),
                targetId: currentUser.id,
                vote,
            });
            candidates[currentUserIndex].vote = vote;
            startTime = new Date();
            if (voteCount === candidates.length) return;
            changeIndex(1);
        } catch (error) {
            console.error("Vote submission failed", error);
            alert("There was an error submitting your vote.");
        } finally {
            loading = false;
        }
    }

    let loading = $state(false);
</script>

<header>
    <h1>Voting</h1>
    <span>{currentUserIndex + 1} / {candidates.length}</span>
</header>

<Dialog bind:dialog onClose={() => (startTime = new Date())} />

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
            <VoteButton voteKey={VoteKey.pass} {castVote} {currentUser} {favouriteUsed} disabled={loading} />
            <VoteButton voteKey={VoteKey.favourite} {castVote} {currentUser} {favouriteUsed} disabled={loading} />
            <VoteButton voteKey={VoteKey.smash} {castVote} {currentUser} {favouriteUsed} disabled={loading} />
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
</style>
