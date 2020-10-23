import { cache } from '../cache';
import { getConfig, getRelativePath } from '../config';
import { getExtensionsToTransform, transformFile } from '../transforms';
import { watch } from './watch';

export const createWatcher = (callback: Function) => {
    const { entryDirPath } = getConfig();
    const extensionsToTransform = getExtensionsToTransform();

    const onFileChangeCallback = async (fileFullPath: string) => {
        const fileRelativePath = getRelativePath(fileFullPath);
        const transformedTextContent = await transformFile(fileFullPath);
        cache.set(fileRelativePath, transformedTextContent);
        callback();
    };

    const onFileDeleteCallback = async (fileFullPath: string) => {
        const fileRelativePath = getRelativePath(fileFullPath);
        cache.delete(fileRelativePath);
        callback();
    };

    return watch({
        watchDirectory: entryDirPath,
        watchExtensions: extensionsToTransform,
        onAdd: onFileChangeCallback,
        onChange: onFileChangeCallback,
        onDelete: onFileDeleteCallback,
    });
};
