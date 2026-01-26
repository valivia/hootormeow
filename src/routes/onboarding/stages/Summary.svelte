<script lang="ts">
    import Button from "components/Button.svelte";
    import Profile from "components/Profile.svelte";
    import { hasFinishedSetup, type ClientUser } from "lib/user";
    import { completeSetup } from "../actions/completeSetup.remote";

    interface Props {
        user: ClientUser;
        stage: number;
    }

    let { user, stage = $bindable() }: Props = $props();

    let disabled = $derived(!hasFinishedSetup(user));
</script>

<header>
    <h1>Summary</h1>
    <p>Review your profile information before finishing your signup.</p>
</header>

<main class="content">
    <Profile {user} />

    <ul class="errors">
        {#each completeSetup.fields.allIssues() as issue}
            <li>{issue.message}</li>
        {/each}
    </ul>

    <form class="navigation" {...completeSetup}>
        <Button type="button" color="var(--theme-accent)" onclick={() => (stage -= 1)}>Back</Button>
        <Button variant="primary" color="var(--theme-accent)" {disabled}>Finish</Button>
    </form>
</main>

<style lang="scss">
    @use "./shared.scss";

    header {
        margin-top: auto;
    }
</style>
