import type { RequestHandler } from "@sveltejs/kit";
import { ensureLoggedIn } from "lib/server/session";
import { sse } from "lib/server/sse";

export const GET: RequestHandler = async ({ request }) => {
    const user = await ensureLoggedIn();


    return new Response(new ReadableStream({
        start: (controller) => {
            sse.addClient(user.id, controller);
        },
        cancel: () => {
            sse.removeClient(user.id);
        }
    }),
        {
            headers: {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache'
            }
        }
    );
};
