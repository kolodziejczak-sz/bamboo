import { IncomingMessage, ServerResponse } from 'http';
import { getConfig } from '../config';
import { DEFAULT_HTML_FILE } from '../constants';
import { cache } from '../cache';
import { getExtensionsToTransform, transformFile } from '../transforms';
import { pathExtension, pathExists, pathJoin } from '../utils';
import { getRequestPath, sendTextAsFile, send404, sendFile } from './helpers';

export const handleFileRequest = async (
    req: IncomingMessage,
    res: ServerResponse
) => {
    const fileRelativePath = getRequestPath(req) || DEFAULT_HTML_FILE;
    const cacheKey = fileRelativePath;

    if (cache.has(cacheKey)) {
        sendTextAsFile(res, fileRelativePath, cache.get(cacheKey));
        return;
    }

    const { entryDirPath } = getConfig();
    const fileFullPath = pathJoin(entryDirPath, fileRelativePath);
    const fileExists = pathExists(fileFullPath);

    if (!fileExists) {
        send404(res);
        return;
    }

    const fileExtension = pathExtension(fileRelativePath);
    const extensionsToTransform = getExtensionsToTransform();
    const shouldTransformFile = extensionsToTransform.includes(fileExtension);

    if (!shouldTransformFile) {
        sendFile(res, fileFullPath);
        return;
    }

    const fileTextContent = await transformFile(fileFullPath);
    cache.set(cacheKey, fileTextContent);

    return sendTextAsFile(res, fileRelativePath, fileTextContent);
};
