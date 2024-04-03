<script lang="ts">
    import UserResult from "components/results/UserResult.svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    let { results } = data;
</script>

<ol>
    {#each results as user (user.id)}
        <UserResult {user} />
    {/each}
</ol>
