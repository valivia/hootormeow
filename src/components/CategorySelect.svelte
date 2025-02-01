<script lang="ts">
    import type { ClientUser } from "lib/user";
    import Form from "./Form.svelte";
    import type { Writable } from "svelte/store";
    import Button from "./Button.svelte";
    import { PUBLIC_ALLOW_CHANGE } from "$env/static/public";

    interface Props {
        user: Writable<ClientUser>;
    }

    let { user }: Props = $props();

    let loading = $state(false);
    let form: HTMLFormElement | undefined = $state();

    function onSuccess(data: unknown) {
        const { isFeminine, isMasculine } = data as ClientUser;
        console.log({ data, isFeminine, isMasculine });
        user.update((u) => {
            u.isFeminine = isFeminine;
            u.isMasculine = isMasculine;
            return u;
        });
    }

    let isFeminine = $state($user.isFeminine);
    let isMasculine = $state($user.isMasculine);

    let atleastOneSelected = $derived(isFeminine || isMasculine);
    let hasChanged = $derived(isFeminine !== $user.isFeminine || isMasculine !== $user.isMasculine);

    let isDisabled = PUBLIC_ALLOW_CHANGE !== "true";
</script>

<h2>Category</h2>
{#if !isDisabled}
    <p>Please select what leaderboard category you'd like to participate in.</p>
{/if}
<Form action="/configure?/update" {onSuccess} bind:loading bind:form>
    <div class="category">
        <label>
            <input type="checkbox" name="isFeminine" bind:checked={isFeminine} disabled={isDisabled} />
            Feminine
        </label>

        <label>
            <input type="checkbox" name="isMasculine" bind:checked={isMasculine} disabled={isDisabled} />
            Masculine
        </label>
        {#if !isDisabled}
            <Button type="submit" disabled={loading || !atleastOneSelected || !hasChanged} grow={false}>Save</Button>
        {/if}
    </div>
</Form>

<style lang="scss">
    p {
        text-align: center;
    }

    .category {
        display: flex;
        flex-direction: column;
        margin-inline: auto;
        gap: 1rem;
    }
</style>
