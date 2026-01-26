import type { Component } from "svelte";
import { IHeart, ISlash, IStar } from "./icons";
import type { SVGAttributes } from "svelte/elements";

export type Vote = typeof voteType;

export enum VoteKey {
    favourite = "favourite",
    smash = "smash",
    pass = "pass",
}

export type VoteType = Record<VoteKey, { score: number; color: string, icon: Component<SVGAttributes<SVGSVGElement>> }>;

export const voteType: VoteType = {
    favourite: {
        score: 41,
        color: "var(--vote-favourite)",
        icon: IStar,
    },
    smash: {
        score: 23,
        color: "var(--vote-smash)",
        icon: IHeart,
    },
    pass: {
        score: -2,
        color: "var(--vote-pass)",
        icon: ISlash,
    },
};
