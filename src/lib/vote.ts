import { IHeart, IHelpCircle, IScissors, ISlash } from "./icons";

export type Vote = typeof VoteType;
export type VoteKey = keyof Vote;

export const VoteType = {
    date: {
        name: "Date",
        color: "var(--theme-success)",
        icon: IHeart,
        score: 1,
    },
    smash: {
        name: "Smash",
        color: "var(--theme-success)",
        icon: IScissors,
        score: 0.75,
    },
    maybe: {
        name: "Maybe",
        color: "var(--theme-warning)",
        icon: IHelpCircle,
        score: 0.25,
    },
    pass: {
        name: "Pass",
        color: "var(--theme-danger)",
        icon: ISlash,
        score: -0.25,
    },
};
