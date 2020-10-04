import { cache } from '../cache';
import { getConfig } from '../config';
import { getExtensionsToTransform, transformFile } from '../transforms';
import { watch } from './watcher';

export const createWatcher = async (callback: Function) => {
    const { entryDirPath } = getConfig();
    const extensionsToTransform = getExtensionsToTransform();

    const onFileChangeCallback = async (
        fileFullPath: string,
        fileRelativePath: string
    ) => {
        const transformedTextContent = await transformFile(fileFullPath);
        cache.set(fileRelativePath, transformedTextContent);
        callback();
    };

    const onFileDeleteCallback = async (
        fileFullPath: string,
        fileRelativePath: string
    ) => {
        cache.delete(fileRelativePath);
        callback();
    };

    watch({
        watchDirectory: entryDirPath,
        watchExtensions: extensionsToTransform,
        onAdd: onFileChangeCallback,
        onChange: onFileChangeCallback,
        onDelete: onFileDeleteCallback,
    });
};
