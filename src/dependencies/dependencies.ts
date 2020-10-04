import builtinModules from 'builtin-modules';
import { parsePackageJson } from '../utils';

type Dependencies = {
    dependencies: string[];
    devDependencies: string[];
    peerDependencies: string[];
};

let dependencies: Dependencies | undefined;

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
    const { dependencies } = getDependencies();
    return dependencies.includes(depName);
};

export const getBuiltInModules = () => {
    return builtinModules as string[];
};
