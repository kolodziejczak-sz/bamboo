import { IncomingMessage, ServerResponse } from 'http';
import {
    createReadStream,
    getMimeType,
    getFileSize,
    pathExtension,
} from '../utils';

export const getRequestPath = (req: IncomingMessage) => req.url.slice(1);

export const send404 = (res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
};

export const sendTextAsFile = (
    res: ServerResponse,
    fileName: string,
    textContent: string
) => {
    const extension = pathExtension(fileName);
    const contentType = getMimeType(extension);
    const contentLength = textContent.length;

    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Cache-Control': 'no-cache',
    }).end(textContent);
};

export const sendFile = (res: ServerResponse, filePath: string) => {
    const extension = pathExtension(filePath);
    const contentType = getMimeType(extension);
    const contentLength = getFileSize(filePath);

    res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': contentLength,
        'Cache-Control': 'no-cache',
    });

    const readStream = createReadStream(filePath);
    readStream.pipe(res);
};
