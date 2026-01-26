import { PUBLIC_MEDIA_PATH, PUBLIC_OWNER_ID } from "$env/static/public";
import { env } from "$env/dynamic/public";
import type { VoteKey } from "./vote";
import type { User } from "@prisma/client";

type UserImageInput = {
    id: string;
    uploadedAt: Date | null;
    avatar: string | null;
}

export function getUserImage(user: UserImageInput) {
    if (user.uploadedAt) return `${PUBLIC_MEDIA_PATH}/${user.id}.jpg?uploadedAt=${Number(user.uploadedAt)}`
    else return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096`;

}

export function hasFinishedSetup(user: ClientUser) {
    return Boolean(user.displayName && user.uploadedAt && (user.isMasc || user.isFem || user.isEnby));
}

export function canAccessSetup(user: ClientUser) {
    if (user.hasFinishedSetup) return canEditProfile(user);
    else return canSignUp(user);
}

export function canEditProfile(user: ClientUser) {
    if (env.PUBLIC_ALLOW_PROFILE_EDIT === "true") return true;
    else return user.allowSetupOverride || isAdmin(user);
}

export function canSignUp(user: ClientUser) {
    if (env.PUBLIC_ALLOW_SIGNUP === "true") return true;
    else return user.allowSignupOverride || isAdmin(user);
}

export function canVote(user: ClientUser) {
    if (env.PUBLIC_ALLOW_VOTING === "true") return true;
    else return user.allowVotingOverride || isAdmin(user);
}

export function canViewResults(user: ClientUser) {
    if (env.PUBLIC_ALLOW_VIEWING_RESULTS === "true") return true;
    else return isAdmin(user);
}

export function isAdmin(user: ClientUser) {
    return user.id === PUBLIC_OWNER_ID;
}


export function getPronouns(user: ClientUser): string {
    const PRONOUN_MAP = {
        she: "her",
        he: "him",
        they: "them",
    } as const;

    const subjects: (keyof typeof PRONOUN_MAP)[] = [];

    if (user.isMasc) subjects.push("he");
    if (user.isFem) subjects.push("she");
    if (user.isEnby) subjects.push("they");

    if (subjects.length === 0) return "None";

    if (subjects.length === 1) {
        const s = subjects[0];
        return `${s}/${PRONOUN_MAP[s]}`;
    }

    return subjects.join("/");
}

export type ClientUser = Omit<User, "token" | "createdAt" | "updatedAt">


export const safeUserOmit = {
    token: true,
};

export type UserWithVotes = ClientUser & {
    votes: {
        [K in VoteKey | "total"]: number;
    }
}

export type UserWithVotesDisplay = UserWithVotes & {
    rank: number;
    isContested: boolean;
}
