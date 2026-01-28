import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { ensureLoggedIn } from "lib/server/session";
import { canViewResults, canVote } from "lib/user";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export const GET: RequestHandler = async ({ params }) => {
    const user = await ensureLoggedIn();
    const id = params.id;

    if (!/^\d+$/.test(id)) {
        throw error(404);
    }

    if (id !== user.id && !(canViewResults(user) || canVote(user))) {
        throw error(404);
    }

    const filePath = path.resolve('media', `${id}.jpg`);

    if (existsSync(filePath) === false) {
        throw error(404);
    }

    const file = await readFile(filePath);

    return new Response(file, {
        headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable'
        }
    });
};
