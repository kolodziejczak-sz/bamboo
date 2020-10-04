import { IncomingMessage, ServerResponse } from 'http';

const subscribers = new Set<ServerResponse>();

export const accept = (req: IncomingMessage, res: ServerResponse) => {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    });

    subscribers.add(res);
    req.on('close', () => subscribers.delete(res));
};

export const send = (data: any) => {
    subscribers.forEach((subscriber) => {
        subscriber.write(`data:${JSON.stringify(data)}\n\n`);
    });
};
