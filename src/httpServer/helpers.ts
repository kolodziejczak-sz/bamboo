import { IncomingMessage, OutgoingHttpHeaders, ServerResponse } from 'http';
import {
    createReadStream,
    getFileSize,
    getMimeType,
    pathExtension,
} from '../utils';

interface HttpResponseOptions {
    statusCode?: number;
    res: ServerResponse;
    headers?: OutgoingHttpHeaders;
    chunk?: string;
    partialChunk?: string;
}

export const getRequestPath = (req: IncomingMessage) => req.url.slice(1);

export const onRequestClose = (req: IncomingMessage, listener: () => void) =>
    req.on('close', listener);

export const send = ({
    chunk,
    headers,
    partialChunk,
    statusCode,
    res,
}: HttpResponseOptions) => {
    const shouldWriteHead = headers !== undefined && statusCode !== undefined;
    if (shouldWriteHead) {
        res.writeHead(statusCode, headers);
    }

    const shouldWrite = partialChunk !== undefined;
    if (shouldWrite) {
        res.write(partialChunk);
    }

    const shouldEnd = chunk !== undefined;
    if (shouldEnd) {
        res.end(chunk);
    }
};

export const send404 = (res: ServerResponse) => {
    send({
        res,
        statusCode: 404,
        headers: { 'Content-Type': 'text/plain' },
        chunk: 'Not found',
    });
};

export const sendTextAsFile = (
    res: ServerResponse,
    fileName: string,
    textContent: string
) => {
    const extension = pathExtension(fileName);
    const contentType = getMimeType(extension);
    const contentLength = textContent.length;

    send({
        res,
        statusCode: 200,
        chunk: textContent,
        headers: {
            'Content-Type': contentType,
            'Content-Length': contentLength,
            'Cache-Control': 'no-cache',
        },
    });
};

export const sendFile = (res: ServerResponse, filePath: string) => {
    const extension = pathExtension(filePath);
    const contentType = getMimeType(extension);
    const contentLength = getFileSize(filePath);

    send({
        res,
        statusCode: 200,
        headers: {
            'Content-Type': contentType,
            'Content-Length': contentLength,
            'Cache-Control': 'no-cache',
        },
    });

    const readStream = createReadStream(filePath);
    readStream.pipe(res);
};
