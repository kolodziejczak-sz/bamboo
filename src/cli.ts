import { pathResolve } from './utils';
import { start } from './index';

export function cli(args: string[]) {
    const cwd = process.cwd();

    start({
        cwd,
        entryDir: pathResolve(cwd, 'src'),
    });
}
