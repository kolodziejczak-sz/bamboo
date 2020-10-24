import { cache } from '../cache';
import { getConfig, getRelativePath } from '../config';
import { getExtensionsToTransform, transformFile } from '../transforms';
import { notifyBrowser } from '../httpServer';
import { watch } from './watch';

export const createWatcher = () => {
    const { entryDirPath } = getConfig();
    const extensionsToTransform = getExtensionsToTransform();

    const onFileChangeCallback = async (fileFullPath: string) => {
        const fileRelativePath = getRelativePath(fileFullPath);
        const transformedTextContent = await transformFile(fileFullPath);
        cache.set(fileRelativePath, transformedTextContent);
        notifyBrowser();
    };

    const onFileDeleteCallback = async (fileFullPath: string) => {
        const fileRelativePath = getRelativePath(fileFullPath);
        cache.delete(fileRelativePath);
        notifyBrowser();
    };

    return watch({
        watchDirectory: entryDirPath,
        watchExtensions: extensionsToTransform,
        onAdd: onFileChangeCallback,
        onChange: onFileChangeCallback,
        onDelete: onFileDeleteCallback,
    });
};
