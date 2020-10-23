import chokidar from 'chokidar';
import { NODE_MODULES } from '../constants';
import { onDestroy } from '../utils';

type WatchHandler = (fileFullPath: string) => Promise<any> | any;

interface WatchOptions {
    onAdd: WatchHandler;
    onChange: WatchHandler;
    onDelete: WatchHandler;
    watchDirectory: string;
    watchExtensions: string[];
}

export const watch = ({
    onAdd,
    onChange,
    onDelete,
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

    watcher.on('add', onAdd).on('change', onChange).on('unlink', onDelete);

    onDestroy(() => watcher.close());

    return watcher;
};
