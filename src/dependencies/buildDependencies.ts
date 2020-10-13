import { cache } from '../cache';
import { getConfig, getDependencyPath } from '../config';
import { PACKAGE_JSON, NODE_MODULES } from '../constants';
import { logError } from '../logger';
import { pathJoin } from '../utils';
import { getDependencies, stringifyDependency } from './dependencies';

export const buildDependencies = async () => {
    const { projectRootPath } = getConfig();

    const packageJsonPath = pathJoin(projectRootPath, PACKAGE_JSON);
    const nodeModulesPath = pathJoin(projectRootPath, NODE_MODULES);
    const { dependencies } = getDependencies(packageJsonPath);

    for (let depName of dependencies) {
        try {
            const depPath = pathJoin(nodeModulesPath, depName);
            const stringifiedDependency = await stringifyDependency(depPath);
            const cacheKey = getDependencyPath(depName);
            cache.set(cacheKey, stringifiedDependency);
        } catch (error) {
            logError(`Failed to build dependency ${depName}: ${error}`);
        }
    }
};
