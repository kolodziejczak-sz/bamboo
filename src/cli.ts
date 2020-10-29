import { program } from 'commander';
import { Config } from './config';
import { start } from './start';
import { getCwdPath, pathJoin } from './utils';

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
    const { dir: typedDir, port: typedPort, root: typedRoot } = program.parse(
        args
    );

    const port = typedPort ? Number(typedPort) : undefined;
    const projectRootPath = typedRoot || getCwdPath();
    const entryDirPath = typedDir
        ? pathJoin(projectRootPath, typedDir)
        : undefined;

    const configDraft = {
        entryDirPath,
        port,
        projectRootPath,
    } as Partial<Config>;

    start(configDraft);
}
