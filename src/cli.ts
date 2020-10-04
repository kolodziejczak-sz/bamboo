import { pathResolve, getCwdPath } from './utils';
import { start } from './index';

export function cli(args: string[]) {
    const cwdPath = getCwdPath();

    // TODO: handle more options

    start({
        cwdPath: cwdPath,
        entryDirPath: pathResolve(cwdPath, 'src'),
    });
}
