import type { User } from "@prisma/client";
import { PUBLIC_MEDIA_PATH } from "$env/static/public";
import type { VoteKey } from "./vote";

type UserImageInput = {
    id: string;
    avatar: string | null;
    uploadedAt: Date | null;
}

export function getUserImage(user: UserImageInput) {
    return user.uploadedAt
        ? `${PUBLIC_MEDIA_PATH}/${user.id}.jpg?uploadedAt=${Number(user.uploadedAt)}`
        : `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}?size=4096`;
}

export type ClientUser = Omit<User, "token" | "createdAt" | "updatedAt">


export const safeUserSelect = {
    id: true,
    userName: true,
    displayName: true,
    avatar: true,
    uploadedAt: true,
    isMasculine: true,
    isFeminine: true,
};

export type UserWithVotes = ClientUser & {
    votes: {
        [K in VoteKey | "total"]: number;
    }
}
