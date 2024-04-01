import { writable } from "svelte/store";

export const load = async ({ parent, data }) => {
    return {
        ...(await parent()),
        user: writable(data.user),
    };
};