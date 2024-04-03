<script lang="ts">
    import ReceivedVotes from "./ReceivedVotes.svelte";
    import { getUserImage, type UserWithVotes } from "lib/user";
    export let user: UserWithVotes;
    $: src = getUserImage(user);
</script>

<li>
    <img {src} alt="avatar" />
    <div class="info">
        <h3>{user.displayName}</h3>
        <ReceivedVotes {user} />
    </div>
    <div class="total">{user.votes.total}</div>
</li>

<style lang="scss">
    @use "styles/utils.scss" as *;

    li {
        @include boxShadow;
        display: flex;
        background-color: var(--theme-secondary);
        border-radius: 100vw;
        gap: 1rem;
        overflow: hidden;

        width: min(60ch, 90vw);

        img {
            width: 96px;
            height: 96px;
            border-radius: 100vw;
        }
    }

    h3 {
        padding-left: 0.2em;
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .total {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        margin-left: auto;
        padding-inline: 1.5rem;
    }
</style>
