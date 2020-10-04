import { isDependency } from '../dependencies';
import { getConfig, getDependencyPath } from '../config';
import {
    pathExists,
    pathExtension,
    pathRelative,
    pathJoin,
    scriptExtensions,
} from '../utils';

const resolveScriptPath = (
    relativeSourceDirPath: string,
    importPath: string
) => {
    const { entryDirPath } = getConfig();
    const fullPathWithoutExt = pathJoin(
        entryDirPath,
        relativeSourceDirPath,
        importPath
    );
    const isDir = pathExists(fullPathWithoutExt);
    const createPathDraft = (base: string, ext: string) =>
        `${base}${isDir ? '/index' : ''}${ext}`;

    for (let ext of scriptExtensions) {
        const filePathDraft = createPathDraft(fullPathWithoutExt, ext);
        if (pathExists(filePathDraft)) {
            return createPathDraft(importPath, ext);
        }
    }
};

const resolveImportPath = (sourceFilePath: string, importPath: string) => {
    const importHasExtension = Boolean(pathExtension(importPath));
    if (importHasExtension) {
        return importPath;
    }

    const sourceDirPath = pathJoin(sourceFilePath, '..');
    const isDependencyImport = isDependency(importPath);
    if (isDependencyImport) {
        const depPath = getDependencyPath(importPath);
        const newImportPath = pathRelative(sourceDirPath, depPath);

        return newImportPath;
    }

    const newImportPath = resolveScriptPath(sourceDirPath, importPath);
    return newImportPath;
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
