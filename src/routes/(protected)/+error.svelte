<script>
    import { page } from "$app/stores";
</script>

<h1>{$page.error?.message}</h1>

<a href="/">Back to home</a>

<style lang="scss">
    h1 {
        width: min(100%, 30ch);
        text-align: center;
        font-weight: 500;
    }
</style>
