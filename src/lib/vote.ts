import { IHeart, IHelpCircle, IScissors, ISlash } from "./icons";

export type Vote = typeof VoteType;
export type VoteKey = keyof Vote;

export const VoteType = {
    date: {
        name: "Date",
        color: "#6cb16c",
        icon: IHeart,
        score: 3.2,
    },
    smash: {
        name: "Smash",
        color: "#839b4e",
        icon: IScissors,
        score: 2.3,
    },
    maybe: {
        name: "Maybe",
        color: "var(--theme-warning)",
        icon: IHelpCircle,
        score: 1.2,
    },
    pass: {
        name: "Pass",
        color: "var(--theme-danger)",
        icon: ISlash,
        score: -0.1,
    },
};
