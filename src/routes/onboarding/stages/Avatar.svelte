<script lang="ts">
    import AvatarUpload from "components/AvatarUpload.svelte";
    import Button from "components/Button.svelte";
    import type { ClientUser } from "lib/user";

    interface Props {
        user: ClientUser;
        stage: number;
    }

    let { user, stage = $bindable() }: Props = $props();

    let disabled = $derived(user.uploadedAt === null);
</script>

<header>
    <h1>Profile Picture</h1>
    <p>Upload a picture of yourself to personalize your account.</p>
</header>

<main class="content">
    <AvatarUpload {user} />

    <fieldset class="navigation">
        <Button type="button" color="var(--theme-accent)" onclick={() => (stage -= 1)}>Back</Button>
        <Button variant="primary" color="var(--theme-accent)" {disabled} onclick={() => (stage += 1)}>Next</Button>
    </fieldset>
</main>

<style lang="scss">
    @use "./shared.scss";
</style>
