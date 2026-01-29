import type { Component } from "svelte";
import { IHeart, ISlash, IStar } from "./icons";
import type { SVGAttributes } from "svelte/elements";

export type Vote = typeof voteType;

export enum VoteKey {
    favourite = "favourite",
    smash = "smash",
    pass = "pass",
}

export type VoteType = Record<VoteKey, { color: string, icon: Component<SVGAttributes<SVGSVGElement>> }>;

export const voteType: VoteType = {
    favourite: {
        color: "var(--vote-favourite)",
        icon: IStar,
    },
    smash: {
        color: "var(--vote-smash)",
        icon: IHeart,
    },
    pass: {
        color: "var(--vote-pass)",
        icon: ISlash,
    },
};
