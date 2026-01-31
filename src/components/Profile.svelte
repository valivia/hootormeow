<script lang="ts">
    import { getPronouns, getUserImage, type ClientUser } from "lib/user";

    let { user }: { user: ClientUser } = $props();
</script>

<section class="profile">
    <img src={getUserImage(user)} alt="user" />
    <div class="profileInfo">
        <span class="name">{user.displayName}</span>
        <span class="pronouns">{getPronouns(user)}</span>
    </div>
</section>

<style lang="scss">
    .profile,
    .profileInfo,
    img {
        border-radius: var(--border-radius);
    }

    .profile {
        position: relative;
        isolation: isolate;
        aspect-ratio: 4 / 5;
        margin-inline: -1rem;
        width: calc(100% + 2rem);

        img {
            position: absolute;
            z-index: -1;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .profileInfo {
        background: linear-gradient(
            0deg,
            color-mix(in srgb, var(--theme-primary) 95%, transparent) 0%,
            color-mix(in srgb, var(--theme-primary) 0%, transparent) 35%
        );
        display: flex;
        padding: 1rem;
        height: 100%;
        flex-direction: column;
        justify-content: flex-end;

        .name {
            font-size: 2rem;
            padding: 0;
            font-weight: 600;
        }

        .pronouns {
            line-height: 0.8;
            font-size: 1.25rem;
            opacity: 0.75;
        }
    }
</style>
