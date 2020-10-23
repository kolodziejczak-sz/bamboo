import builtinModules from 'builtin-modules';
import { PACKAGE_JSON, DEFAULT_SCRIPT_FILE } from '../constants';
import { build } from '../esbuild';
import { createTextDecoder, pathJoin, parsePackageJson } from '../utils';

type Dependencies = {
    dependencies: string[];
    devDependencies: string[];
    peerDependencies: string[];
};

let dependencies: Dependencies | undefined;

const decoder = createTextDecoder();
const safeObjectKeys = (obj: any = {}) => Object.keys(obj);

const parsePackageJsonForDependencies = (
    packageJsonPath: string
): Dependencies => {
    const {
        dependencies,
        devDependencies,
        peerDependencies,
    } = parsePackageJson(packageJsonPath);

    return {
        dependencies: safeObjectKeys(dependencies),
        devDependencies: safeObjectKeys(devDependencies),
        peerDependencies: safeObjectKeys(peerDependencies),
    };
};

export const getDependencies = (packageJsonPath?: string) => {
    const shouldParsePackageJson = Boolean(packageJsonPath);
    if (shouldParsePackageJson) {
        dependencies = parsePackageJsonForDependencies(packageJsonPath);
    }

    return dependencies;
};

export const isDependency = (depName: string) => {
    const depsByCategory = getDependencies();

    return Boolean(depsByCategory?.dependencies.includes(depName));
};

export const stringifyDependency = async (depPath: string): Promise<string> => {
    const depPackageJsonPath = pathJoin(depPath, PACKAGE_JSON);
    const { main = DEFAULT_SCRIPT_FILE } = parsePackageJson(depPackageJsonPath);
    const depEntryPath = pathJoin(depPath, main);

    const { outputFiles } = await build({
        entryPoints: [depEntryPath],
        write: false,
        minify: true,
        bundle: true,
        format: 'esm',
        external: builtinModules as string[],
    });
    const uint8ArrayContent = outputFiles[0].contents;
    const stringifiedDependency = decoder.decode(uint8ArrayContent);

    return stringifiedDependency;
};
