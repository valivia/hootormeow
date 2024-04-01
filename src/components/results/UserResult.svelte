<script lang="ts">
    import ReceivedVotes from "./ReceivedVotes.svelte";
    import { getUserImage, type UserWithVotes } from "lib/user";
    export let user: UserWithVotes;
    $: src = getUserImage(user);
</script>

<li class="UserResult">
    <div class="avatarContainer">
        <div class="avatar">
            <img {src} alt="avatar" />
        </div>
        <div class="info">
            <h3>{user.userName}</h3>
        </div>
    </div>
    <ReceivedVotes votes={user.votesReceived} />
</li>

<style lang="scss">
    @use "styles/utils.scss" as *;

    .avatarContainer {
        display: flex;
        align-items: center;
        flex-direction: column;
        margin-right: 1rem;
    }
    li {
        @include boxShadow;
        list-style: none;
        margin: 8px 0;
        font-family: "raleway", Helvetica, sans-serif;
        display: flex;
        align-items: center;
        padding: 0.125rem;
        background-color: var(--theme-secondary);
        border-radius: 0.5rem;
        flex-direction: column;
        // margin-right: 1rem;
        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
    }
    .info {
        h3 {
            margin: 0;
        }
    }
</style>
