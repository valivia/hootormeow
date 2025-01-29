<script lang="ts">
    import { IWarning } from "lib/icons";

    let { data } = $props();
    let { user } = data;
</script>

<h1>Hoot or Meow</h1>
{#if !$user.isFeminine && !$user.isMasculine}
    <p class="warning">
        <IWarning style="color: var(--theme-warning)"/>
        You haven't selected a category yet, please head over to the <a href="/configure">Settings</a> to select one
    </p>
{/if}

<p>There are currently {data.userCount} users signed up.</p>

<a href="/vote">Vote</a>
<a href="/results">Results</a>
<a href="/configure">Settings</a>

<style lang="scss">
    .warning {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background-color: var(--theme-tertiary);
        border: 1px solid var(--theme-warning);
        padding: 0.75rem;
        border-radius: 0.25rem;
    }
</style>
