<script lang="ts">
    import Button from "components/Button.svelte";
    import { getUserImage, type ClientUser } from "lib/user";
    import { PUBLIC_MAX_FILE_SIZE } from "$env/static/public";
    import { loadAvatar } from "../routes/onboarding/actions/loadAvatar.remote";
    import { invalidateAll } from "$app/navigation";
    import { setAvatar } from "../routes/onboarding/actions/setAvatar.remote";

    let { user }: { user: ClientUser } = $props();

    let fileInput: HTMLInputElement | null = $state(null);
    let files: FileList | null = $state(null);
    let src = $derived.by(() => {
        if (files) return URL.createObjectURL(files[0]);
        return getUserImage(user);
    });

    let loading = $state(false);

    async function loadBaseAvatar() {
        try {
            loading = true;
            await loadAvatar();
            await invalidateAll();
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error updating avatar:", error);
            alert("There was an error updating your avatar. Please try again.");
        } finally {
            loading = false;
        }
    }
</script>

<button onclick={() => fileInput?.click()} disabled={loading}>
    <img {src} alt="user avatar" />
</button>

<form
    {...setAvatar.enhance(async ({ submit }) => {
        try {
            loading = true;
            await submit();
            alert("Avatar updated successfully!");
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("There was an error uploading your avatar. Please try again.");
        } finally {
            loading = false;
            files = null;
        }
    })}
    enctype="multipart/form-data"
>
    <input
        {...setAvatar.fields.avatar.as("file")}
        bind:this={fileInput}
        onchange={(event) => {
            const file = event.currentTarget.files?.[0];
            if (file && file.size > Number(PUBLIC_MAX_FILE_SIZE) * 1024 * 1024) {
                alert(`File is too large. Max size is ${PUBLIC_MAX_FILE_SIZE}MB.`);
                return;
            }
            files = event.currentTarget.files;
        }}
        hidden
        accept="image/jpeg, image/png, image/webp, image/avif"
    />
    <fieldset>
        {#if files}
            <Button type="button" color="var(--theme-danger)" disabled={loading} on:click={() => (files = null)}>
                Reset
            </Button>
            <Button type="submit" variant="primary" color="var(--theme-accent)" disabled={loading}>Upload</Button>
        {:else if !user.isDiscordAvatar}
            <Button type="button" color="var(--theme-accent)" disabled={loading} onclick={loadBaseAvatar}>
                use discord avatar
            </Button>
        {/if}
    </fieldset>
</form>

<style lang="scss">
    button {
        $size: min(16rem, 100vw);
        width: $size;
        padding: 0;

        border: none;
        border-radius: var(--border-radius);
        overflow: hidden;

        outline: 1px solid currentColor;
        transition: all 100ms ease-in-out;

        margin-bottom: 1rem;

        &:hover:not(:disabled),
        &:focus:not(:disabled) {
            outline-offset: 0.5em;
            color: var(--theme-accent);
        }
    }

    img {
        width: 100%;
        height: 100%;
        aspect-ratio: 4 / 5;
        object-fit: cover;
    }
</style>
