import { IncomingMessage, ServerResponse } from 'http';
import { cache } from '../cache';

const accept = (res: ServerResponse) => {
    res.writeHead(200, {
        Connection: 'keep-alive',
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
    });
};

const send = (res: ServerResponse, data: any) => {
    res.write(`data:${JSON.stringify(data)}\n\n`);
};

export const handleEventSourceRequest = async (
    req: IncomingMessage,
    res: ServerResponse
) => {
    accept(res);
    send(res, { message: 'hello world' });

    req.on('close', () => console.log('connection close'));
};
