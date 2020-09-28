import { IncomingMessage, ServerResponse } from 'http';
import { pathExtension, getMimeType } from '../utils';

export const getRequestPath = (req: IncomingMessage) => req.url.slice(1);

export const sendTextAsFile = (
    res: ServerResponse,
    filePath: string,
    textContent: string
) => {
    const extension = pathExtension(filePath);
    const contentType = getMimeType(extension);
    const contentLength = textContent.length;

    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Cache-Control': 'no-cache',
    }).end(textContent);
};

export const send404 = (res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
};
