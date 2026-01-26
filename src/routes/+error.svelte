<script>
    import { page } from "$app/state";
    import Anchor from "components/Anchor.svelte";
</script>

<main>
    <span>{page.status}</span>
    <h1>{page.error?.message}</h1>
    <section>
        <Anchor href="/">Go back to the homepage</Anchor>
        <Anchor href="/auth/logout" variant="secondary" color="var(--theme-danger)">Log out</Anchor>
    </section>
</main>

<style lang="scss">
    @use "styles/info" as *;
</style>
