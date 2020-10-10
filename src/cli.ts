import { pathResolve, normalizeSlashes } from './utils';
import { start } from './index';

export function cli(args: string[]) {
    const projectRootPath = normalizeSlashes(process.cwd());

    // TODO: handle more options

    start({
        projectRootPath,
        entryDirPath: pathResolve(projectRootPath, 'src'),
    });
}
