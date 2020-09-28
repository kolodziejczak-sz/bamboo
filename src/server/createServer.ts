import http, { IncomingMessage, ServerResponse } from 'http';
import { getConfig } from '../config';
import { onDestroy } from '../utils';
import { getRequestPath } from './utils';
import { handleFileRequest } from './handleFileRequest';
import { handleEventSourceRequest } from './handleEventSourceRequest';

export const createServer = () => {
    const { eventSourcePath } = getConfig();

    const httpServer = http.createServer(
        async (req: IncomingMessage, res: ServerResponse) => {
            const path = getRequestPath(req);
            const isSseReq = eventSourcePath === path;

            if (isSseReq) {
                handleEventSourceRequest(req, res);
            } else {
                handleFileRequest(req, res);
            }
        }
    );

    onDestroy(() => httpServer.close());

    return httpServer;
};
