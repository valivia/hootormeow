<script lang="ts">
    import type { ClientUser } from "lib/user";
    import Button from "components/Button.svelte";
    import { setGenderIdentity } from "../actions/setGenderIdentity.remote";

    interface Props {
        user: ClientUser;
        stage: number;
    }

    let { user, stage = $bindable() }: Props = $props();

    let genderState = $state({ isMasc: user.isMasc, isFem: user.isFem, isEnby: user.isEnby });
    let hasChanged = $derived.by(
        () =>
            genderState.isMasc !== user.isMasc ||
            genderState.isFem !== user.isFem ||
            genderState.isEnby !== user.isEnby,
    );
    let isValid = $derived(genderState.isMasc || genderState.isFem || genderState.isEnby);
    let disabled = $derived(setGenderIdentity.pending > 0 || !isValid);

    async function enhanced({ submit }: { submit: () => Promise<void> }) {
        try {
            if (!hasChanged && isValid) {
                stage += 1;
                return;
            }

            await submit();

            if (setGenderIdentity.result) {
                stage += 1;
            }
        } catch (error) {
            console.error("Submission failed", error);
        }
    }

    const { isMasc, isFem, isEnby } = setGenderIdentity.fields;
</script>

<header>
    <h1>Gender Identity</h1>
    <p>Select one or more gender Identities that describe you best.</p>
</header>

<form {...setGenderIdentity.enhance(enhanced)} class="content">
    <label>
        <input {...isMasc.as("checkbox")} type="checkbox" bind:checked={genderState.isMasc} />
        Masculine
    </label>
    <label>
        <input {...isFem.as("checkbox")} type="checkbox" bind:checked={genderState.isFem} />
        Feminine
    </label>
    <label>
        <input {...isEnby.as("checkbox")} type="checkbox" bind:checked={genderState.isEnby} />
        Non-binary
    </label>

    <ul class="errors">
        {#each setGenderIdentity.fields.allIssues() as issue}
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
