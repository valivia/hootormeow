<script context="module" lang="ts">
    export type Variant = "primary" | "secondary";
</script>

<script lang="ts">
    import type { HTMLAnchorAttributes } from "svelte/elements";

    interface $$Props extends HTMLAnchorAttributes {
        href: string;
        variant?: Variant;
        color?: string;
        loading?: boolean;
        grow?: boolean;
    }

    export let href: $$Props["href"];
    export let variant: $$Props["variant"] = "secondary";
    export let color: $$Props["color"] = "var(--theme-text)";
    export let loading: $$Props["loading"] = false;
    export let grow: $$Props["grow"] = true;
</script>

<a
class="clickable"
    {...$$restProps}
    style="--color: {color}"
    data-variant={variant}
    data-color={color}
    aria-busy={loading}
    class:loading
    class:grow
    {href}
>
    <slot />
</a>

<style lang="scss">
    @import "./clickable.scss";
</style>
