<script lang="ts">
    import UserResult from "components/results/UserResult.svelte";
    import type { PageData } from "./$types";
    export let data: PageData;
    import { VoteType } from "lib/vote";
    import type { UserWithVotes } from "lib/user";
    let { users } = data;

    function getVoteTypeScore(vote: keyof typeof VoteType) {
        if (VoteType.hasOwnProperty(vote)) return VoteType[vote].score;

        return 0;
    }

    function sortUsersByScore(users: UserWithVotes[]): UserWithVotes[] {
        return users.sort((a, b) => {
            const aScore = a.votesReceived.reduce(
                (acc, vote) =>
                    (acc += getVoteTypeScore(
                        vote.vote as keyof typeof VoteType,
                    )),
                0,
            );
            const bScore = b.votesReceived.reduce(
                (acc, vote) =>
                    (acc += getVoteTypeScore(
                        vote.vote as keyof typeof VoteType,
                    )),
                0,
            );
            return bScore - aScore;
        });
    }
</script>

<ol>
    {#await sortUsersByScore(users)}
        <p>Loading...</p>
    {:then users}
        {#each users as user}
            <UserResult {user} />
        {/each}
    {/await}
</ol>