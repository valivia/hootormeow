<script lang="ts">
    import { VoteType } from "lib/vote";
    import type { Vote } from "@prisma/client";
    export let votes: Vote[];
</script>

<div class="received-votes">
    <ul class="votes">
        {#each Object.entries(VoteType) as [key, value]}
            <li style="color: {value.color}">
                <svelte:component this={value.icon} />
                {votes.filter((vote) => vote.vote === key).length}
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
