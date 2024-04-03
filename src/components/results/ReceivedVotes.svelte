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
    ul {
        list-style: none;
        display: flex;
        gap: 0.5em;
        justify-content: space-between;
        margin: 0.625rem;
        flex-wrap: wrap;
        flex-direction: row;
    }
    .received-votes {
        margin: 0.625rem;
        font-family: "raleway", Helvetica, sans-serif;
    }

    li {
        display: inline-flex;
        align-items: center;
        gap: 0.5em;
    }
</style>
