import { cache } from '../cache';
import { getConfig, getDependencyPath } from '../config';
import { PACKAGE_JSON, NODE_MODULES, DEFAULT_SCRIPT_FILE } from '../constants';
import { logError } from '../logger';
import { pathJoin, parsePackageJson } from '../utils';
import { getDependencies, getBuiltInModules } from './dependencies';
import { build } from '../esbuild';

const decoder = new TextDecoder('utf-8');

const stringifyDependency = async (
    depsDirPath: string,
    depName: string
): Promise<string> => {
    const depPath = pathJoin(depsDirPath, depName);
    const depPackageJsonPath = pathJoin(depPath, PACKAGE_JSON);
    const { main = DEFAULT_SCRIPT_FILE } = parsePackageJson(depPackageJsonPath);
    const depEntryPath = pathJoin(depPath, main);

    const { outputFiles } = await build({
        entryPoints: [depEntryPath],
        write: false,
        minify: true,
        bundle: true,
        format: 'esm',
        external: getBuiltInModules(),
    });
    const uint8ArrayContent = outputFiles[0].contents;
    const stringifiedDependency = decoder.decode(uint8ArrayContent);

    return stringifiedDependency;
};

export const buildDependencies = async () => {
    const { projectRootPath } = getConfig();

    const packageJsonPath = pathJoin(projectRootPath, PACKAGE_JSON);
    const nodeModulesPath = pathJoin(projectRootPath, NODE_MODULES);
    const { dependencies } = getDependencies(packageJsonPath);

    for (let depName of dependencies) {
        try {
            const stringifiedDependency = await stringifyDependency(
                nodeModulesPath,
                depName
            );
            const cacheKey = getDependencyPath(depName);
            cache.set(cacheKey, stringifiedDependency);
        } catch (error) {
            logError(`Failed to build dependency ${depName}: ${error}`);
        }
    }
};
