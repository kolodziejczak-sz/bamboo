import builtinModules from 'builtin-modules';
import { build } from './esbuild';
import { getConfig } from './config';
import { pathCombine, parsePackageJson } from './utils';
import { cache } from './cache';

const dependenciesPath = 'bundled_node_modules';
const nodeModulesDirName = 'node_modules';
const packageJsonFilename = 'package.json';
const defaultEntryFilename = 'index.js';

const decoder = new TextDecoder('utf-8');
let dependencies: { [key: string]: string[] } | undefined;

const safeObjectKeys = (obj) => Object.keys(obj || {});

const parsePackageJsonForDependencies = (packageJsonPath: string) => {
    const {
        dependencies,
        devDependencies,
        peerDependencies,
    } = parsePackageJson(packageJsonPath);

    return {
        builtinModules: builtinModules as string[],
        dependencies: safeObjectKeys(dependencies),
        devDependencies: safeObjectKeys(devDependencies),
        peerDependencies: safeObjectKeys(peerDependencies),
    };
};

export const createDependencyPath = (depName: string) =>
    `${dependenciesPath}/${depName}.js`;

export const getDependencies = () => {
    if (!dependencies) {
        const { cwd } = getConfig();
        const packagePath = pathCombine(cwd, packageJsonFilename);
        dependencies = parsePackageJsonForDependencies(packagePath);
    }
    return dependencies;
};

export const buildDependencies = async () => {
    const { dependencies, builtinModules } = getDependencies();
    const { cwd } = getConfig();
    const nodeModulesPath = pathCombine(cwd, nodeModulesDirName);

    for (let depName of dependencies) {
        const depPath = pathCombine(nodeModulesPath, depName);
        const depPackagePath = pathCombine(depPath, packageJsonFilename);
        const { main = defaultEntryFilename } = parsePackageJson(
            depPackagePath
        );
        const depEntry = pathCombine(depPath, main);

        try {
            const { outputFiles } = await build({
                entryPoints: [depEntry],
                write: false,
                minify: true,
                bundle: true,
                format: 'esm',
                external: builtinModules,
            });
            const uint8ArrayContent = outputFiles[0].contents;
            const textContent = decoder.decode(uint8ArrayContent);

            const cacheKey = createDependencyPath(depName);
            cache.set(cacheKey, textContent);
        } catch (err) {
            console.log(err);
        }
    }
};
