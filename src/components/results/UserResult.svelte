<script lang="ts">
    import ReceivedVotes from "./ReceivedVotes.svelte";
    import { getUserImage, type UserWithVotes } from "lib/user";
    export let user: UserWithVotes;
    export let index: number;
    $: src = getUserImage(user);
</script>

<li>
    <img {src} alt="avatar" />
    <div class="info">
        <h3><span>{index + 1}.</span> {user.displayName}</h3>
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
        gap: 0.5rem;
        overflow: hidden;

        width: min(60ch, 90vw);

        img {
            width: 96px;
            height: 96px;
            border-radius: 100vw;
        }
    }

    h3 {
        font-size: clamp(1rem, 3vw, 1.3rem);

        & span {
            opacity: 0.5;
            font-size: 0.8em;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        justify-content: space-between;
        padding-block: 0.7rem;
    }

    .total {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        margin-left: auto;
        padding-right: 1.5rem;
    }
</style>
