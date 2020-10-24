import { IncomingMessage, ServerResponse } from 'http';
import { onRequestClose, send } from './helpers';

const subscribers = new Set<ServerResponse>();

export const acceptEventSource = (
    req: IncomingMessage,
    res: ServerResponse
) => {
    send({
        res,
        statusCode: 200,
        headers: {
            Connection: 'keep-alive',
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
        },
    });

    subscribers.add(res);
    onRequestClose(req, () => subscribers.delete(res));
};

export const sendEvent = (data: Object) => {
    subscribers.forEach((subscriber) => {
        send({
            res: subscriber,
            partialChunk: `data:${JSON.stringify(data)}\n\n`,
        });
    });
};

export const notifyBrowser = () => sendEvent('');
