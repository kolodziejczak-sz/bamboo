import { setConfig } from './config';
import { pathCombine } from './utils';
import { start } from './index';

export function cli(args: string[]) {
    const cwd = process.cwd();

    setConfig({
        cwd,
        entryDir: pathCombine(cwd, 'src'),
    });

    start();
}
