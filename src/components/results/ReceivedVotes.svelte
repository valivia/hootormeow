<script lang="ts">
    import { voteType } from "lib/vote";
    import type { UserWithVotes } from "lib/user";
    import type { Component } from "svelte";
    import type { SVGAttributes } from "svelte/elements";
    export let user: UserWithVotes;

    // Awful code
    const VoteTypes = Object.entries(voteType) as [
        keyof UserWithVotes["votes"],
        { color: string; icon: Component<SVGAttributes<SVGSVGElement>> },
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
        font-size: clamp(0.7rem, 1.5vw, 1rem);
        list-style: none;
        gap: 0.7em;
    }

    li {
        display: flex;
        flex-direction: column;
        align-items: center;

        :global(> svg) {
            width: 1.2em;
            height: 1.2em;
        }
    }
</style>
