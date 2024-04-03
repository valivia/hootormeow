<script lang="ts">
    import { enhance } from "$app/forms";
    import type { SubmitFunction } from "@sveltejs/kit";
    import type { HTMLFormAttributes } from "svelte/elements";

    const defaultFailure = (result: unknown) => {
        let error = "An error occurred";

        if (result && typeof result === "object") {
            if ("validationError" in result) {
                error = Object.values(result.validationError as string[])
                    .map((value) => " - " + value)
                    .join("\n");
            } else if ("message" in result) {
                error = result.message as string;
            } else {
                console.log(result);
            }
        } else {
            console.log(result);
        }

        alert(error);
    };

    interface $$Props extends HTMLFormAttributes {
        action: string;
        onSubmit?: SubmitFunction;
        onSuccess?: (data: unknown) => void;
        onFailure?: (data: unknown) => void;
        onError?: (data: unknown) => void;
        loading?: boolean;
        reset?: boolean;
        id?: string;
        enctype?: string;
    }

    export let action: $$Props["action"];
    export let onSubmit: $$Props["onSubmit"] = undefined;
    export let onSuccess: $$Props["onSuccess"] = () => {};
    export let onFailure: $$Props["onFailure"] = defaultFailure;
    export let onError: $$Props["onError"] = defaultFailure;
    export let loading: $$Props["loading"] = false;
    export let reset: $$Props["reset"] = false;
    export let id: $$Props["id"] = undefined;
    export let enctype: $$Props["enctype"] = undefined;

    const handleSubmit: SubmitFunction = () => {
        loading = true;

        return async ({ update, result }) => {
            loading = false;
            let failed = false;

            if (result.type === "error") {
                failed = true;
                console.error(result.error);
                onError?.(result.error);
            }

            if (result.type === "failure") {
                failed = true;
                onFailure?.(result.data);
            }

            if (result.type === "success") {
                onSuccess?.(result.data);
            }

            await update({ reset: failed ? false : reset });
        };
    };
</script>

<form
    {id}
    method="POST"
    {action}
    use:enhance={onSubmit ?? handleSubmit}
    {enctype}
>
    <slot />
</form>

<style lang="scss">
    form {
        :global(fieldset) {
            display: flex;
            flex-wrap: wrap;
            border: none;
            column-gap: 0.5rem;
        }

        :global(fieldset > *) {
            flex: 1;
        }
    }
</style>
