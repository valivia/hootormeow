<script lang="ts">
    import UserResult from "components/results/UserResult.svelte";

    let { data } = $props();
    let { results } = data;

    let category = $state("feminine");

    $inspect(category);
    $inspect(results);

    let displayedUsers = $derived.by(() => {
        return results.filter((user) => {
            if (category === "feminine") {
                return user.isFeminine;
            } else if (category === "masculine") {
                return user.isMasculine;
            } else {
                return true;
            }
        });
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
    {#each displayedUsers as user, index (user.id)}
        <UserResult {user} {index} />
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

            &:has(input:checked), &:hover {
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
