<script lang="ts">
    import Form from "components/Form.svelte";
    import type { PageData } from "./$types";
    import { getUserImage } from "lib/user";
    import Button from "components/Button.svelte";
    import { VoteType } from "lib/vote";
    import Anchor from "components/Anchor.svelte";
    import type { Vote } from "@prisma/client";

    export let data: PageData;
    let { candidates } = data;
    let currentUserIndex = 0;
    let voteCount = 0;

    // Find the first candidate that has not been voted on
    for (let i = 0; i < candidates.length; i++) {
        // If the candidate has not been voted on, set the current user to that candidate
        if (candidates[i].vote === null) {
            currentUserIndex = i;
            break;
        }
        voteCount++;

        // If all candidates have been voted on, set the current user to the last candidate
        if (i === candidates.length - 1) {
            currentUserIndex = candidates.length - 1;
        }
    }

    function onSuccess(result: { vote: Vote }) {
        if (candidates[currentUserIndex].vote === null) {
            voteCount++;
        }

        candidates[currentUserIndex].vote = result.vote.vote;
        changeIndex(1);
    }

    function changeIndex(change: number) {
        currentUserIndex += change;
        if (currentUserIndex < 0) {
            currentUserIndex = 0;
        } else if (currentUserIndex >= candidates.length) {
            currentUserIndex = candidates.length - 1;
        }
    }

    $: currentUser = candidates[currentUserIndex];
    $: src = getUserImage(currentUser);

    // Progress
    $: progressString = `${Math.round((voteCount / candidates.length) * 100)}% (${voteCount}/${candidates.length})`;
    $: progress = (voteCount / candidates.length) * 100;
    let loading = false;
</script>

<div class="wrapper">
    <Form action="/vote?/castVote" {onSuccess} bind:loading>
        <!-- Name -->
        <h1>{currentUser.displayName}</h1>

        <!-- image -->
        <img {src} alt="user" />

        {currentUserIndex + 1}

        <!-- progress -->
        <div class="progress">
            Progress: {progressString}
        </div>

        <div class="progress-bar">
            <div class="progress-inner" style="width: {progress}%;"></div>
        </div>

        <!-- Input -->
        <input type="hidden" name="targetId" value={currentUser.id} />
        <fieldset class="button-group">
            {#each Object.entries(VoteType) as [key, value]}
                <Button
                    type="submit"
                    name="vote"
                    variant={currentUser?.vote === key
                        ? "primary"
                        : "secondary"}
                    value={key}
                    color={value.color}
                    disabled={loading || currentUser.vote === key}
                >
                    <svelte:component this={value.icon} />
                    {value.name}
                </Button>
            {/each}
        </fieldset>

        <fieldset>
            <Button
                type="button"
                disabled={loading || currentUserIndex === 0}
                on:click={() => changeIndex(-1)}
            >
                Previous
            </Button>

            {#if currentUserIndex === candidates.length - 1}
                <Anchor
                    href="/results"
                    variant="primary"
                    color="var(--theme-accent)">Results</Anchor
                >
            {:else}
                <Button
                    type="button"
                    disabled={loading}
                    on:click={() => changeIndex(1)}
                >
                    Next
                </Button>{/if}
        </fieldset>
    </Form>
</div>

<style lang="scss">
    @use "styles/utils.scss" as *;

    h1 {
        font-weight: normal;
        border-bottom: 1px solid currentColor;
        padding-inline: 0.5em;
        font-size: clamp(2rem, 5vw, 3rem);
    }

    .wrapper {
        width: min(60ch, 100%);

        :global(> form) {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
    }

    img {
        $size: min(40ch, 100vw);
        width: $size;
        height: $size;
        border-radius: var(--border-radius);
        @include boxShadow;
    }

    .progress-bar {
        width: 100%;
        height: 1rem;
        background-color: var(--theme-secondary);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    .progress-inner {
        height: 100%;
        background-color: var(--theme-accent);
        transition: width 0.3s ease-in-out;
    }
</style>
