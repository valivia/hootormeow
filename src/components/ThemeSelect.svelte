<script lang="ts" module>
    const themes = {
        light: { displayName: "Light" },
        dark: { displayName: "Dark" },
    };

    export function setTheme(themeKey: keyof typeof themes) {
        const theme = themes[themeKey];
        if (!theme) {
            document.documentElement.removeAttribute("data-theme");
            localStorage.removeItem("theme");
            return;
        }

        document.documentElement.setAttribute("data-theme", themeKey);
        localStorage.setItem("theme", themeKey);
    }

    export function getTheme() {
        const key = localStorage.getItem("theme");
        if (key && key in themes) return key as keyof typeof themes;
        return undefined;
    }

    export function syncTheme() {
        const theme = getTheme();
        if (theme) setTheme(theme);
    }
</script>

<script lang="ts">
    import { onMount } from "svelte";

    let theme: keyof typeof themes = $state("light");

    onMount(() => {
        theme = getTheme() || "light";
    });
</script>

<select bind:value={theme} onchange={() => setTheme(theme)}>
    {#each Object.entries(themes) as [key, value]}
        <option value={key}>{value.displayName}</option>
    {/each}
</select>

<style lang="scss">
    select {
        padding: 0.5rem;
        font-size: 1rem;
        border: 2px solid currentColor;
        border-radius: var(--border-radius);
        color: currentColor;
        background-color: var(--theme-primary);

        min-width: 10ch;

        &:hover,
        &:focus-visible {
            outline-color: var(--theme-accent);
            border-color: var(--theme-accent);
        }
    }
</style>
