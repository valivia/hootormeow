<script lang="ts">
    import ReceivedVotes from "./ReceivedVotes.svelte";
    import { getUserImage, type UserWithVotesDisplay } from "lib/user";

    interface Props {
        user: UserWithVotesDisplay;
    }

    let { user }: Props = $props();

    let { rank, isContested } = user;

    let src = getUserImage(user);
</script>

<li data-rank={rank}>
    <img {src} alt="avatar" />
    <div class="info">
        <h3><span>{rank}.</span> {user.displayName}</h3>
        <ReceivedVotes {user} />
    </div>
    <div class="total" class:isContested>{user.votes.total.toFixed(1)}</div>
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

        &[data-rank="1"] {
            border: rgb(221, 168, 22) 2px solid;
        }

        &[data-rank="2"] {
            border: rgb(165, 165, 165) 2px solid;
        }

        &[data-rank="3"] {
            border: rgb(185, 101, 49) 2px solid;
        }
    }

    .isContested {
        text-decoration: underline;
        text-decoration-color: var(--theme-accent);
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
