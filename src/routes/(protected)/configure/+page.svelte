<script lang="ts">
    import Form from "components/Form.svelte";
    import Button from "components/Button.svelte";
    import { getUserImage, type ClientUser } from "lib/user";
    import { SaveIcon, Trash2Icon } from "svelte-feather-icons";
    import type { PageData } from "./$types";

    export let data: PageData;
    let user = data.user;

    let fileInput: HTMLInputElement;
    let files: FileList | null = null;
    let src: string | null;

    function onSuccess(user: ClientUser) {
        $user.uploadedAt = user.uploadedAt;
        files = null;
    }

    $: {
        if (files) src = URL.createObjectURL(files?.[0]);
        else src = getUserImage($user);
    }

    let loading = false;
</script>

<h1>Configure your profile {$user.displayName}</h1>
<p>Please upload an image of yourself</p>

<button on:click={() => fileInput.click()}>
    <img {src} alt="user" />
</button>
<div class="buttons">
    <Form
        {onSuccess}
        action="/configure?/upload"
        enctype="multipart/form-data"
        bind:loading
    >
        <input
            type="file"
            name="file"
            bind:this={fileInput}
            bind:files
            hidden
            accept="image/jpeg, image/png, image/webp, image/avif"
        />

        <fieldset>
            <Button type="submit" disabled={loading || files === null} icon>
                <SaveIcon />
            </Button>

            {#if $user.uploadedAt}
                <Form action="/configure?/delete" bind:loading {onSuccess}>
                    <Button
                        type="submit"
                        color="var(--theme-danger)"
                        disabled={loading}
                        icon
                    >
                        <Trash2Icon />
                    </Button>
                </Form>
            {/if}
        </fieldset>
    </Form>
</div>

<style lang="scss">
    .buttons {
        display: flex;
        gap: 1em;
    }
    button {
        $size: min(16rem, 100vw);
        width: $size;
        height: $size;
        padding: 0;

        border-radius: 50%;
        overflow: hidden;

        outline: 2px solid currentColor;
        transition: all 100ms ease-in-out;

        &:hover,
        &:focus {
            outline-offset: 0.5em;
            color: var(--theme-accent);
        }
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
</style>
