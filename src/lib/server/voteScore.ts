import type { VoteKey } from "lib/vote";

export const voteScore: Record<VoteKey, number> = {
    favourite: 31,
    smash: 17,
    pass: -2,
};

export const NEGATIVE_VOTER_DEBUFF = 0.2 * voteScore.smash;
export const NEGATIVE_VOTER_DEBUFF_THRESHOLD = 0.9;
export const VOTE_COMPLETE_BONUS = 0.8 * voteScore.smash;
