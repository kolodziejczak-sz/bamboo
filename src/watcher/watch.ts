import chokidar from 'chokidar';
import { NODE_MODULES } from '../constants';
import { onDestroy } from '../utils';

type WatchHandler = (fileFullPath: string) => Promise<any> | any;

interface WatchOptions {
    onFilesChange: WatchHandler;
    watchDirectory: string;
    watchExtensions: string[];
}

export const watch = ({
    onFilesChange,
    watchDirectory,
    watchExtensions,
}: WatchOptions) => {
    const ignored = [`**/${NODE_MODULES}/**`];
    const pathsToWatch = watchExtensions.map(
        (ext: string) => `${watchDirectory}/**/*${ext}`
    );

    const watcher = chokidar.watch(pathsToWatch, {
        ignored,
        ignoreInitial: true,
    });

    watcher.on('change', onFilesChange).on('unlink', onFilesChange);

    onDestroy(() => watcher.close());

    return watcher;
};
