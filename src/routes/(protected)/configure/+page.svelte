<script lang="ts">
    import Form from "components/Form.svelte";
    import Button from "components/Button.svelte";
    import { getUserImage, type ClientUser } from "lib/user";
    import { PUBLIC_ALLOW_CHANGE, PUBLIC_ALLOW_SIGNUP, PUBLIC_MAX_FILE_SIZE } from "$env/static/public";
    import { ISave, ITrashCan } from "lib/icons";
    import CategorySelect from "components/CategorySelect.svelte";

    let { data } = $props();

    let { user } = data;

    let fileInput: HTMLInputElement | null = $state(null);
    let files: FileList | null = $state(null);
    let src = $derived.by(() => {
        if (files) return URL.createObjectURL(files[0]);
        return getUserImage($user);
    });

    function onSuccess(input: unknown) {
        $user.uploadedAt = (input as ClientUser).uploadedAt;
        files = null;
    }

    let loading = $state(false);
</script>

<h1>{$user.displayName}</h1>
{#if PUBLIC_ALLOW_CHANGE === "true"}
    <p>Please upload an image of yourself</p>
{:else}
    <p>Profile editing is currently disabled</p>
{/if}

<button onclick={() => fileInput?.click()} disabled={PUBLIC_ALLOW_CHANGE !== "true"}>
    <img {src} alt="user" />
</button>

{#if PUBLIC_ALLOW_CHANGE === "true"}
    <Form action="/configure?/upload" enctype="multipart/form-data" bind:loading {onSuccess}>
        <input
            type="file"
            name="file"
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
            <Button type="submit" disabled={loading || files === null} icon>
                <ISave />
            </Button>
            {#if files}
                <Button
                    type="button"
                    color="var(--theme-danger)"
                    disabled={loading}
                    icon
                    on:click={() => (files = null)}
                >
                    <ITrashCan />
                </Button>
            {:else if $user.uploadedAt}
                <Button form="avatarDelete" type="submit" color="var(--theme-danger)" disabled={loading} icon>
                    <ITrashCan />
                </Button>
            {/if}
        </fieldset>
    </Form>

    <Form id="avatarDelete" action="/configure?/delete" bind:loading {onSuccess}></Form>
{/if}

<CategorySelect {user} />

<h2>Account management</h2>
<section>
    {#if data.voteCount > 0}
        <Form action="/configure?/resetVotes" bind:loading onSuccess={() => (data.voteCount = 0)}>
            <Button
                type="submit"
                color="var(--theme-danger)"
                disabled={loading}
                on:click={(event) => confirm("Are you sure you want to reset your votes?") || event.preventDefault()}
            >
                Reset votes
            </Button>
        </Form>
    {/if}
    <Form action="/configure?/deleteAccount" bind:loading>
        <Button
            type="submit"
            color="var(--theme-danger)"
            disabled={loading}
            on:click={(event) =>
                confirm(
                    "Are you sure you want to delete your account?" + PUBLIC_ALLOW_SIGNUP !== "true"
                        ? " sign up is currently disabled, you will NOT be able to make a new account."
                        : "",
                ) || event.preventDefault()}
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

        border: none;
        border-radius: var(--border-radius);
        overflow: hidden;

        outline: 1px solid currentColor;
        transition: all 100ms ease-in-out;

        &:hover:not(:disabled),
        &:focus:not(:disabled) {
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
