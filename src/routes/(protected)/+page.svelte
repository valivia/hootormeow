<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<h1>Hoot or Meow</h1>
<p>There are currently {data.userCount} users waiting to vote.</p>

<a href="/vote">Vote</a>
<a href="/results">Results</a>
<a href="/configure">Configure avatar</a>