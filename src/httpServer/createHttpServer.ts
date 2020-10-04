import http, { IncomingMessage, ServerResponse } from 'http';
import { getConfig } from '../config';
import { onDestroy } from '../utils';
import { getRequestPath } from './helpers';
import { handleFileRequest } from './handleFileRequest';
import * as sse from './serverSentEvents';

export const createHttpServer = () => {
    const { port, eventSourcePath } = getConfig();

    const httpServer = http.createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
            const requestPath = getRequestPath(req);
            const isSseReq = eventSourcePath === requestPath;

            if (isSseReq) {
                sse.accept(req, res);
            } else {
                handleFileRequest(req, res);
            }
        }
    );

    httpServer.listen(port);
    onDestroy(() => httpServer.close());

    return {
        notifyBrowser: () => sse.send(''),
    };
};
