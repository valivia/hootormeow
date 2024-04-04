<script lang="ts">
    import UserResult from "components/results/UserResult.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    let { results } = data;
</script>

<ol>
    {#each results as user, index (user.id)}
        <UserResult {user} {index} />
    {/each}
</ol>

<style lang="scss">
    ol {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>
