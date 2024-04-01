<script context="module" lang="ts">
    export type Variant = "primary" | "secondary";
</script>

<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface $$Props extends HTMLButtonAttributes {
        variant?: Variant;
        color?: string;
        loading?: boolean;
        grow?: boolean;
        icon?: boolean;
    }

    export let variant: $$Props["variant"] = "secondary";
    export let color: $$Props["color"] = "var(--theme-text)";
    export let loading: $$Props["loading"] = false;
    export let grow: $$Props["grow"] = true;
    export let icon: $$Props["icon"] = false;
</script>

<button
    class="clickable"
    {...$$restProps}
    style="--color: {color}"
    data-icon={icon}
    data-variant={variant}
    data-color={color}
    aria-busy={loading}
    disabled={$$restProps.disabled || loading}
    class:loading
    class:grow
    on:click
>
    <slot />
</button>

<style lang="scss">
    @import "./clickable.scss";
</style>
