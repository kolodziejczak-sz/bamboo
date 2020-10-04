import chokidar from 'chokidar';
import { NODE_MODULES } from '../constants';
import { getRelativePath } from '../config';
import { onDestroy } from '../utils';

type WatchHandler = (
    fileFullPath: string,
    fileRelativePath: string
) => Promise<any> | any;

interface WatchOptions {
    watchDirectory: string;
    watchExtensions: string[];
    ignored?: string[];
    onChange: WatchHandler;
    onDelete: WatchHandler;
    onAdd: WatchHandler;
}

export const watch = ({
    watchDirectory,
    watchExtensions,
    onChange,
    onAdd,
    onDelete,
}: WatchOptions) => {
    const ignored = [`**/${NODE_MODULES}/**`];
    const pathsToWatch = watchExtensions.map(
        (ext: string) => `${watchDirectory}/**/*${ext}`
    );

    const watcher = chokidar.watch(pathsToWatch, {
        ignored,
        ignoreInitial: true,
    });

    const withRelativePath = (handler: WatchHandler) => (
        fileFullPath: string
    ) => {
        const fileRelativePath = getRelativePath(fileFullPath);
        handler(fileFullPath, fileRelativePath);
    };

    watcher
        .on('add', withRelativePath(onAdd))
        .on('change', withRelativePath(onChange))
        .on('unlink', withRelativePath(onDelete));

    const stopWatch = () => watcher.close();

    onDestroy(stopWatch);

    return stopWatch;
};
