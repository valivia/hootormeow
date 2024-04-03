import type { User, Vote } from "@prisma/client";
import { PUBLIC_MEDIA_PATH } from "$env/static/public";

export function getUserImage(user: ClientUser) {
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
};

export type UserWithVotes = ClientUser & {
    votesReceived: Vote[];
    votesCasted: Vote[]
};