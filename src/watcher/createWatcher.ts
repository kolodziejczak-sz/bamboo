import { cache } from '../cache';
import { getConfig, getRelativePath } from '../config';
import { getExtensionsToTransform } from '../transforms';
import { notifyBrowser } from '../httpServer';
import { watch } from './watch';

export const createWatcher = () => {
    const { entryDirPath } = getConfig();
    const extensionsToTransform = getExtensionsToTransform();

    const fileChangesHandler = async (fileFullPath: string) => {
        const cacheKey = getRelativePath(fileFullPath);
        if (cache.has(cacheKey)) {
            cache.delete(cacheKey);
            notifyBrowser();
        }
    };

    return watch({
        onFilesChange: fileChangesHandler,
        watchDirectory: entryDirPath,
        watchExtensions: extensionsToTransform,
    });
};
