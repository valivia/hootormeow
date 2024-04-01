import type { User, Vote } from "@prisma/client";

export function getUserImage(user: ClientUser) {
    return user.uploadedAt
        ? `/media/${user.id}.jpg?uploadedAt=${Number(user.uploadedAt)}`
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