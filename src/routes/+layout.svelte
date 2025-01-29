<script lang="ts">
    let { data, children } = $props();
</script>

{@render children()}

<svelte:head>
    <meta name="theme-color" content="#bf8d50" />
</svelte:head>

<style lang="scss">
    @use "styles/global.scss" as *;
</style>
