import { BuildOptions, TransformOptions } from './esbuild';
import { TransformsCreatorFunction } from './transforms';
import { compactObj, getCwdPath, identity, pathRelative } from './utils';

let config = {
    buildOptions: {} as BuildOptions,
    dependenciesPath: 'bundled_node_modules',
    entryDirPath: getCwdPath(),
    eventSourcePath: '__reload__',
    port: 3000,
    projectRootPath: getCwdPath(),
    transformOptions: {} as TransformOptions,
    transformsCreatorFunction: identity as TransformsCreatorFunction,
};

export type Config = typeof config;

export const getConfig = () => config;

export const setConfig = (update: Partial<typeof config>) => {
    const compactUpdate = compactObj(update);

    config = {
        ...config,
        ...compactUpdate,
    };
};

export const getDependencyPath = (depName: string) =>
    `${config.dependenciesPath}/${depName}.js`;

export const getRelativePath = (path: string) =>
    pathRelative(config.entryDirPath, path).slice(2 /* remove ./ */);
