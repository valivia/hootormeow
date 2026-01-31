<script lang="ts">
    import Progress from "components/Progress.svelte";
    import { ILogOut } from "lib/icons";
    import DisplayName from "./stages/DisplayName.svelte";
    import GenderIdentity from "./stages/GenderIdentity.svelte";
    import Summary from "./stages/Summary.svelte";
    import Avatar from "./stages/Avatar.svelte";
    import Intro from "./stages/Intro.svelte";
    import type { Snapshot } from "./$types";

    const { data } = $props();
    let user = $derived(data.user);

    let stage = $state(0);

    export const snapshot: Snapshot<number> = {
        capture: () => stage,
        restore: (value) => (stage = value),
    };

    const stageCount = 5;
</script>

<a
    href="/auth/logout"
    class="logout"
    onclick={(e) => confirm("Are you sure you want to log out?") || e.preventDefault()}
>
    <ILogOut />
</a>

<div class="wrapper">
    {#if stage === 0}
        <Intro {user} bind:stage />
    {:else if stage === 1}
        <DisplayName {user} bind:stage />
    {:else if stage === 2}
        <GenderIdentity {user} bind:stage />
    {:else if stage === 3}
        <Avatar {user} bind:stage />
    {:else if stage === 4}
        <Summary {user} bind:stage />
    {/if}
</div>

<Progress value={(stage / (stageCount - 1)) * 100} label="Onboarding Progress" />

<style lang="scss">
    .logout {
        position: absolute;
        top: 1.2rem;
        right: 1.2rem;
        color: inherit;
        font-size: 1.2rem;

        &:hover,
        &:focus {
            color: var(--theme-danger);
        }
    }

    .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 75dvh;
    }
</style>
