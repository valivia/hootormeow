<script lang="ts">
    import type { ClientUser } from "lib/user";
    import Form from "./Form.svelte";
    import type { Writable } from "svelte/store";
    import Button from "./Button.svelte";

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
</script>

<h2>Category</h2>
<p>Please select what leaderboard category you'd like to participate in.</p>
<Form action="/configure?/update" {onSuccess} bind:loading bind:form>
    <div class="category">
        <label>
            <input type="checkbox" name="isFeminine" bind:checked={isFeminine} />
            Feminine
        </label>

        <label>
            <input type="checkbox" name="isMasculine" bind:checked={isMasculine} />
            Masculine
        </label>

        <Button type="submit" disabled={loading || !atleastOneSelected || !hasChanged} grow={false}>Save</Button>
    </div>
</Form>

<style lang="scss">
    .category {
        display: flex;
        flex-direction: column;
        margin-inline: auto;
        gap: 1rem;
    }
</style>
