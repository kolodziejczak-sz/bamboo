import http, { IncomingMessage, ServerResponse } from 'http';
import { cache } from './cache';
import { getConfig } from './config';
import { runTransforms } from './transforms';
import {
    pathExists,
    pathResolve,
    pathExtension,
    getMimeType,
    readFileAsText,
} from './utils';

const sendTextAsFile = (
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

const send404 = (res: ServerResponse) => {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
};

export const createServer = () =>
    http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const fileRelativePath = req.url.slice(1) || 'index.html';
        const cacheKey = fileRelativePath;

        if (cache.has(cacheKey)) {
            sendTextAsFile(res, fileRelativePath, cache.get(cacheKey));
            return;
        }

        const { entryDir } = getConfig();
        const fileFullPath = pathResolve(entryDir, fileRelativePath);
        const fileExists = pathExists(fileFullPath);

        if (!fileExists) {
            return send404(res);
        }

        const textContent = await readFileAsText(fileFullPath);
        const transformedTextContent = await runTransforms(
            fileRelativePath,
            textContent
        );

        cache.set(cacheKey, transformedTextContent);

        return sendTextAsFile(res, fileRelativePath, transformedTextContent);
    });
