<script lang="ts">
    import "styles/global.scss";
    import { syncTheme } from "components/ThemeSelect.svelte";
    import { browser } from "$app/environment";

    let { children } = $props();

    if (browser) syncTheme();
</script>

{@render children()}
