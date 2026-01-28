<script lang="ts">
    import Button from "components/Button.svelte";
    import { VoteKey, voteType } from "lib/vote";
    import VoteButton from "./VoteButton.svelte";

    interface Props {
        dialog: HTMLDialogElement;
    }

    let { dialog = $bindable() }: Props = $props();
</script>

<dialog bind:this={dialog}>
    <ul>
        <li>
            <VoteButton voteKey={VoteKey.pass} currentUser={{ vote: null }} />
            <span>Pass</span>
        </li>
        <li>
            <VoteButton voteKey={VoteKey.favourite} currentUser={{ vote: null }} />
            <span>Favourite</span>
        </li>
        <li>
            <VoteButton voteKey={VoteKey.smash} currentUser={{ vote: null }} />
            <span>Smash</span>
        </li>
    </ul>

    <h1>Voting</h1>

    <p>
        For each candidate you will be prompted to vote with one of the above options, You decide what metric you use
        for this choice yourself.
    </p>

    <p>You can only use the "Favourite" vote once so use it on the candidate you like most!.</p>

    <Button onclick={() => dialog.close()} variant="primary" color="var(--theme-accent)">Start Voting</Button>
</dialog>

<style lang="scss">
    dialog {
        position: fixed;
        inset: 0;
        z-index: 10;
        width: var(--content-width);

        margin: auto;
        padding: 1rem;

        border: none;
        border-radius: 0.5rem;

        background-color: var(--theme-secondary);
        color: var(--theme-text);

        text-align: center;

        &::backdrop {
            background-color: oklch(from var(--theme-primary) 20% 10% h / 0.8);
        }
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 1rem 0;

        display: flex;
        gap: 1.5rem;
        justify-content: center;

        li {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
    }

    h1 {
        margin-top: -0.5lh;
    }

    p {
        margin-bottom: 0.5rem;
    }
</style>
