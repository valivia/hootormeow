class SSE {
    clients: { [key: string]: ReadableStreamDefaultController } = {};

    public addClient(id: string, client: ReadableStreamDefaultController) {
        this.clients[id] = client;
    }

    public removeClient(id: string) {
        delete this.clients[id];
    }

    public broadcast(message: string) {
        for (const id in this.clients) {
            this.clients[id].enqueue(`data: ${message}\n\n`);
        }
    }
}

export const sse = new SSE();
