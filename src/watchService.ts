import chokidar from 'chokidar';
import { getConfig } from './config';
import { onDestroy } from './utils';

export const watch = () => {
    const { entryDir } = getConfig();
    const watcher = chokidar.watch(entryDir, {
        ignored: ['node_modules'],
    });

    watcher
        .on('add', (path: string) => console.log(`File ${path} has been added`))
        .on('change', (path: string) =>
            console.log(`File ${path} has been changed`)
        )
        .on('unlink', (path: string) =>
            console.log(`File ${path} has been removed`)
        );

    onDestroy(() => watcher.close());
};
