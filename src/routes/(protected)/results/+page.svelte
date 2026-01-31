<script lang="ts">
    import UserResults from "components/results/UserResults.svelte";
    import { type UserWithVotes } from "lib/user";
    import { getResults } from "./results.remote";
    import Progress from "components/Progress.svelte";
    import type { Snapshot } from "./$types";

    let data = getResults();

    const categories = $derived.by(() => {
        let options = ["All"];
        if (data.current?.results.some((user) => user.isEnby)) options.unshift("Enby");
        if (data.current?.results.some((user) => user.isFem)) options.unshift("Fem");
        if (data.current?.results.some((user) => user.isMasc)) options.unshift("Masc");
        return options;
    });

    let category = $state("All");

    export const snapshot: Snapshot<string> = {
        capture: () => category,
        restore: (value) => (category = value),
    };

    function getFilteredList(results: UserWithVotes[], category: string) {
        let lastIndex = 0;
        if (!data.current) {
            return [];
        }
        const output = results
            // Filter by category
            .filter((user) => {
                switch (category) {
                    case "Fem":
                        return user.isFem;
                    case "Masc":
                        return user.isMasc;
                    case "Enby":
                        return user.isEnby;
                    default:
                        return true;
                }
            })
            // Add rank and contested status
            .map((user, i, arr) => {
                const lastUser = i > 0 ? arr[i - 1] : null;
                const nextUser = i < arr.length - 1 ? arr[i + 1] : null;
                const sameAsLast = lastUser?.votes.total.toFixed(1) === user.votes.total.toFixed(1);
                const sameAsNext = nextUser?.votes.total.toFixed(1) === user.votes.total.toFixed(1);
                const isContested = sameAsLast || sameAsNext;

                let rank = lastIndex;
                if (!sameAsLast) {
                    rank = lastIndex + 1;
                }
                lastIndex = rank;

                return {
                    ...user,
                    rank,
                    isContested,
                };
            });

        lastIndex = 0;

        return output;
    }
</script>

<header>
    <h1>Results</h1>
    <!-- Progress -->
    {#if data.error}
        <p class="error">{data.error.body.message}</p>
    {/if}
    {#if data.current}
        {@const { totalVotesCasted, userCount } = data.current}
        {@const percentVoted = totalVotesCasted === 0 ? 0 : (totalVotesCasted / (userCount * (userCount - 1))) * 100}
        <p>{percentVoted.toFixed(1)}% of votes have been counted</p>
        <Progress value={Number(percentVoted)} max={100} />
    {/if}
</header>

<main>
    <!-- Category select -->
    {#if categories.length > 2}
        <section class="selector">
            {#each categories as option}
                <label>
                    <input type="radio" name="category" value={option} bind:group={category} />
                    {option}
                </label>
            {/each}
        </section>
    {/if}

    <!-- Results -->
    {#if data.current}
        {@const displayedUsers = getFilteredList(data.current.results, category)}
        <UserResults users={displayedUsers} />
    {/if}
</main>

<style lang="scss">
    @use "styles/utils" as *;

    header,
    main {
        margin-inline: auto;
    }

    header {
        width: var(--content-width);
    }

    main {
        @include content-width(60ch, 70ch);
    }

    .selector {
        display: flex;

        color: var(--theme-accent);
        border: 2px solid currentColor;
        border-radius: 100vw;
        overflow: hidden;
        width: fit-content;

        margin-inline: auto;
        margin-block: 1.5rem 1rem;

        label {
            padding: 0.3rem 1rem;
            font-weight: 600;

            &:has(input:checked),
            &:hover {
                background-color: var(--theme-accent);
                color: var(--theme-primary);
            }

            &:not(:last-child) {
                border-right: 1px solid currentColor;
            }
        }

        input {
            display: none;
        }
    }
</style>
