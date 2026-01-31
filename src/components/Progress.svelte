<script lang="ts">
    import { Tween } from "svelte/motion";

    const { value, label }: { value: number; max?: number; label?: string } = $props();

    let progress = new Tween(value);

    $effect(() => {
        progress.target = value;
    });
</script>

<div style="--progress: {progress.current}%" aria-label={label}></div>

<style lang="scss">
    div {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 8px;
        background-color: var(--theme-secondary);

        background: linear-gradient(
            to right,
            var(--theme-accent) 0%,
            var(--theme-accent) calc(var(--progress)),
            var(--theme-secondary) calc(var(--progress)),
            var(--theme-secondary) 100%
        );
    }
</style>
