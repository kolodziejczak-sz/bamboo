import { getDependencies, createDependencyPath } from '../dependencies';
import { getConfig } from '../config';
import {
    pathExists,
    pathExtension,
    pathCombine,
    pathRelative,
    scriptExtensions,
} from '../utils';

const resolveScriptExtension = (fullPathWithoutExt: string) => {
    for (let ext of scriptExtensions) {
        if (pathExists(`${fullPathWithoutExt}${ext}`)) {
            return ext;
        }
    }
};

const resolveImportPath = (sourceFilePath: string, importPath: string) => {
    const importHasExtension = Boolean(pathExtension(importPath));
    if (importHasExtension) {
        return importPath;
    }

    const { dependencies } = getDependencies();
    if (dependencies.includes(importPath)) {
        const entryDir = pathRelative(sourceFilePath, './');
        return `${entryDir}/${createDependencyPath(importPath)}`;
    }

    const { entryDir } = getConfig();
    const fullPathWithoutExt = pathCombine(
        entryDir,
        sourceFilePath,
        importPath
    );
    const sourceFileExt = pathExtension(sourceFilePath);
    const scriptExt =
        resolveScriptExtension(fullPathWithoutExt) || sourceFileExt;
    const isDir = pathExists(fullPathWithoutExt);

    return isDir
        ? `${importPath}/index${scriptExt}`
        : `${importPath}${scriptExt}`;
};

const parseStaticImports = async (sourceFilePath, textContent) => {
    const importRegex = new RegExp(`(from\\s+["|'])(.+)("|')`, 'g');

    return textContent.replace(
        importRegex,
        (fullMatch, pre, importPath, post) => {
            const newImportPath = resolveImportPath(sourceFilePath, importPath);
            return `${pre}${newImportPath}${post}`;
        }
    );
};

const parseDynamicImports = async (sourceFilePath, textContent) => {
    const importRegex = new RegExp(`(import\\s*\\(["|'])(.+)(["|']\\))`, 'g');

    return textContent.replace(
        importRegex,
        (fullMatch, pre, importPath, post) => {
            const newImportPath = resolveImportPath(sourceFilePath, importPath);
            return `${pre}${newImportPath}${post}`;
        }
    );
};

export const transformEsImports = async (
    sourceFilePath: string,
    textContent: string
) => {
    textContent = await parseStaticImports(sourceFilePath, textContent);
    textContent = await parseDynamicImports(sourceFilePath, textContent);
    return textContent;
};
