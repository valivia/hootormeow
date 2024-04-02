<script lang="ts">
    import Form from "components/Form.svelte";
    import type { PageData } from "./$types";
    import { getUserImage } from "lib/user";
    import Button from "components/Button.svelte";
    import { VoteType } from "lib/vote";
    import Anchor from "components/Anchor.svelte";
    export let data: PageData;
    let { users } = data;
    let current_user_index = 0;

    function onSuccess() {
        changeIndex(1);
    }

    function changeIndex(change: number) {
        current_user_index += change;
        if (current_user_index < 0) {
            current_user_index = 0;
        } else if (current_user_index >= users.length) {
            current_user_index = users.length - 1;
        }
    }

    $: current_user = users[current_user_index];
    $: src = getUserImage(current_user);
    $: progress_string = `${Math.round(calculateProgress())}% (${current_user_index}/${users.length})`;
    $: progress = (current_user_index / users.length) * 100;
    let loading = false;

    // Calculate the progress percentage
    function calculateProgress(): number {
        return ((current_user_index + 1) / users.length) * 100;
    }
</script>

<div class="wrapper">
    <Form action="/vote?/castVote" {onSuccess} bind:loading>
        <!-- Name -->
        <h1>{current_user.displayName}</h1>

        <!-- image -->
        <img {src} alt="user" />

        <!-- progress -->
        <div class="progress">
            Progress: {progress_string}
        </div>

        <div class="progress-bar">
            <div class="progress-inner" style="width: {progress}%;"></div>
        </div>

        <!-- Input -->
        <input
            type="hidden"
            name="targetId"
            value={users[current_user_index].id}
        />
        <fieldset class="button-group">
            {#each Object.entries(VoteType) as [key, value]}
                <Button
                    type="submit"
                    name="vote"
                    value={key}
                    color={value.color}
                    disabled={loading}
                >
                    <svelte:component this={value.icon} />
                    {value.name}
                </Button>
            {/each}
        </fieldset>

        <fieldset>
            <Button
                type="button"
                disabled={loading || current_user_index === 0}
                on:click={() => changeIndex(-1)}
            >
                Previous
            </Button>

            {#if current_user_index === users.length - 1}
                <Anchor href="/results">Results</Anchor>
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
