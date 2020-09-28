import { IncomingMessage, ServerResponse } from 'http';
import { cache } from '../cache';
import { getConfig } from '../config';
import { runTransforms } from '../transforms';
import { pathExists, pathResolve, readFileAsText } from '../utils';
import { getRequestPath, sendTextAsFile, send404 } from './utils';

export const handleFileRequest = async (
    req: IncomingMessage,
    res: ServerResponse
) => {
    const fileRelativePath = getRequestPath(req) || 'index.html';
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
};
