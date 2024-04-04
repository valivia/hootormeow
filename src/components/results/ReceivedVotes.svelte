<script lang="ts">
    import { VoteType } from "lib/vote";
    import type { UserWithVotes } from "lib/user";
    import type { SvelteComponent } from "svelte";
    export let user: UserWithVotes;

    // Awful code
    const VoteTypes = Object.entries(VoteType) as [
        keyof UserWithVotes["votes"],
        { color: string; icon: typeof SvelteComponent },
    ][];
</script>

<div class="received-votes">
    <ul class="votes">
        {#each VoteTypes as [key, value]}
            <li style="color: {value.color}">
                <svelte:component this={value.icon} />
                {user.votes[key]}
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
    ul,
    li {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
    }
    ul {
        font-size: clamp(0.8rem, 3vw, 1rem);
        list-style: none;
        gap: 0.7em;
    }

    li {
        gap: 0.2em;

        :global(> svg) {
            width: 1.2em;
            height: 1.2em;
        }
    }
</style>
