import { program } from 'commander';
import { Config } from './config';
import { getCwdPath, pathJoin } from './utils';
import { start } from './start';

program
    .option(
        '-r, --root <absolute-path>',
        'a full path to the project root directory'
    )
    .option(
        '-d, --dir <relative-path>',
        'a directory to serve files from (relative to root path)'
    )
    .option('-p, --port <number>', 'the port for a http server');

export function cli(args: string[]) {
    const { root: typedRoot, dir: typedDir, port: typedPort } = program.parse(
        args
    );

    const projectRootPath = typedRoot || getCwdPath();
    const entryDirPath = typedDir
        ? pathJoin(projectRootPath, typedDir)
        : undefined;
    const port = typedPort ? Number(typedPort) : undefined;

    const configDraft = {
        projectRootPath,
        entryDirPath,
        port,
    } as Partial<Config>;

    start(configDraft);
}
