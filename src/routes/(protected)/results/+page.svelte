<script lang="ts">
    import UserResult from "components/results/UserResult.svelte";
    import type { UserWithVotesDisplay } from "lib/user.js";

    let { data } = $props();
    let { results } = data;

    let category = $state("both");

    $inspect(category);
    $inspect(results);

    let displayedUsers: UserWithVotesDisplay[] = $derived.by(() => {
        let lastIndex = 0;
        const output = results
            // Filter by category
            .filter((user) => {
                if (category === "feminine") {
                    return user.isFeminine;
                } else if (category === "masculine") {
                    return user.isMasculine;
                }
                return true;
            })
            // Add rank and contested status
            .map((user, i, arr) => {
                const lastUser = i > 0 ? arr[i - 1] : null;
                const nextUser = i < arr.length - 1 ? arr[i + 1] : null;
                const sameAsLast = lastUser?.votes.total === user.votes.total;
                const sameAsNext = nextUser?.votes.total === user.votes.total;
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
    });
</script>

<h1>Results</h1>

<section class="selector">
    <label>
        <input type="radio" name="category" value="feminine" bind:group={category} />
        Feminine
    </label>
    <label>
        <input type="radio" name="category" value="masculine" bind:group={category} />
        Masculine
    </label>
    <label>
        <input type="radio" name="category" value="both" bind:group={category} />
        Both
    </label>
</section>

<ol>
    {#each displayedUsers as user (user.id + user.rank)}
        <UserResult {user} />
    {/each}
</ol>

<style lang="scss">
    ol {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .selector {
        display: flex;

        border: 2px solid var(--theme-text);
        border-radius: 100vw;
        overflow: hidden;

        label {
            padding: 0.3rem 1rem;
            font-weight: 600;

            &:has(input:checked),
            &:hover {
                background-color: var(--theme-text);
                color: var(--theme-primary);
            }

            &:not(:last-child) {
                border-right: 1px solid var(--theme-text);
            }
        }

        input {
            display: none;
        }
    }
</style>
