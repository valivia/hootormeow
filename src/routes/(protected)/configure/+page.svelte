<script lang="ts">
    import Form from "components/Form.svelte";
    import Button from "components/Button.svelte";
    import { getUserImage, type ClientUser } from "lib/user";
    import { SaveIcon, Trash2Icon } from "svelte-feather-icons";
    import type { PageData } from "./$types";
    import { PUBLIC_MAX_FILE_SIZE } from "$env/static/public";

    export let data: PageData;
    let user = data.user;
    let voteCount = data.voteCount;

    let fileInput: HTMLInputElement;
    let files: FileList | null = null;
    let src: string | null;

    function onSuccess(user: ClientUser) {
        $user.uploadedAt = user.uploadedAt;
        files = null;
    }

    $: {
        if (
            files &&
            files[0]?.size > Number(PUBLIC_MAX_FILE_SIZE) * 1024 * 1024
        ) {
            alert(`File is too large. Max size is ${PUBLIC_MAX_FILE_SIZE}MB.`);
            files = null;
        }
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
        {#if files}
            <Button
                type="button"
                color="var(--theme-danger)"
                disabled={loading}
                icon
                on:click={() => (files = null)}
            >
                <Trash2Icon />
            </Button>
        {:else if $user.uploadedAt}
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

<h2>Account management</h2>
<section>
    {#if voteCount > 0}
        <Form action="/configure?/resetVotes" bind:loading {onSuccess}>
            <Button
                type="submit"
                color="var(--theme-danger)"
                disabled={loading}
                on:click={(event) =>
                    confirm("Are you sure you want to reset your votes?") ||
                    event.preventDefault()}
            >
                Reset votes
            </Button>
        </Form>
    {/if}
    <Form action="/configure?/deleteAccount" bind:loading {onSuccess}>
        <Button
            type="submit"
            color="var(--theme-danger)"
            disabled={loading}
            on:click={(event) =>
                confirm("Are you sure you want to delete your account?") ||
                event.preventDefault()}
        >
            Delete account
        </Button>
    </Form>
</section>

<style lang="scss">
    section {
        display: flex;
        gap: 0.5em;
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
