import {
    HeartIcon,
    ScissorsIcon,
    HelpCircleIcon,
    SlashIcon,
} from "svelte-feather-icons";

export type Vote = typeof VoteType;
export type VoteKey = keyof Vote;

export const VoteType = {
    date: {
        name: "Date",
        color: "var(--theme-success)",
        icon: HeartIcon,
        score: 1.5,
    },
    smash: {
        name: "Smash",
        color: "var(--theme-success)",
        icon: ScissorsIcon,
        score: 1,
    },
    maybe: {
        name: "Maybe",
        color: "var(--theme-warning)",
        icon: HelpCircleIcon,
        score: 0.5,
    },
    pass: {
        name: "Pass",
        color: "var(--theme-danger)",
        icon: SlashIcon,
        score: -1,
    },
};
