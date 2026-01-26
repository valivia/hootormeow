<script lang="ts">
    import type { ClientUser } from "lib/user";
    import Button from "components/Button.svelte";
    import { setDisplayName } from "../actions/setDisplayName.remote";

    interface Props {
        user: ClientUser;
        stage: number;
    }

    let { user, stage = $bindable() }: Props = $props();

    let value = $state(user.displayName || "");
    let hasChanged = $derived.by(() => value !== user.displayName);
    let isValid = $derived(value.trim().length >= 3 && value.trim().length <= 32);
    let disabled = $derived(setDisplayName.pending > 0 || !isValid);

    async function enhanced({ submit }: { submit: () => Promise<void> }) {
        try {
            if (!hasChanged && isValid) {
                stage += 1;
                return;
            }

            await submit();

            if (setDisplayName.result) {
                stage += 1;
            }
        } catch (error) {
            console.error("Submission failed", error);
        }
    }

    const { displayName } = setDisplayName.fields;
</script>

<header>
    <h1>Display Name</h1>
    <p>This is how others will see you on the platform.</p>
</header>

<form {...setDisplayName.enhance(enhanced)} class="content">
    <label>
        Display Name
        <input {...displayName.as("text")} bind:value />
    </label>

    <ul class="errors">
        {#each setDisplayName.fields.allIssues() as issue}
            <li>{issue.message}</li>
        {/each}
    </ul>

    <fieldset class="navigation">
        <Button type="button" color="var(--theme-accent)" onclick={() => (stage -= 1)}>Back</Button>
        <Button variant="primary" color="var(--theme-accent)" {disabled}>Next</Button>
    </fieldset>
</form>

<style lang="scss">
    @use "./shared.scss" as *;

    @include label;
    @include errors;
</style>
