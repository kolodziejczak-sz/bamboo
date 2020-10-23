import { pathRelative } from './utils';

let config = {
    transformsCreatorFunction: undefined,
    projectRootPath: '',
    dependenciesPath: 'bundled_node_modules',
    entryDirPath: '',
    eventSourcePath: '__reload__',
    port: 3000,
};

export type Config = typeof config;

export const getConfig = () => config;

export const setConfig = (update: Partial<typeof config>) => {
    config = {
        ...config,
        ...update,
    };
};

export const getDependencyPath = (depName: string) =>
    `${config.dependenciesPath}/${depName}.js`;

export const getRelativePath = (path: string) =>
    pathRelative(config.entryDirPath, path).slice(2 /* remove ./ */);
