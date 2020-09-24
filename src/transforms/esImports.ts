import { getDependencies, createDependencyPath } from '../dependencies';
import { getConfig } from '../config';
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
    const { entryDir } = getConfig();
    const fullPathWithoutExt = pathJoin(
        entryDir,
        relativeSourceDirPath,
        importPath
    );
    const isDir = pathExists(fullPathWithoutExt);
    const createPathDraft = (ext: string, base: string = fullPathWithoutExt) =>
        `${base}${isDir ? '/index' : ''}${ext}`;

    for (let ext of scriptExtensions) {
        const filePathDraft = createPathDraft(ext);
        if (pathExists(filePathDraft)) {
            return createPathDraft(ext, importPath);
        }
    }
};

const resolveImportPath = (sourceFilePath: string, importPath: string) => {
    const importHasExtension = Boolean(pathExtension(importPath));
    if (importHasExtension) {
        return importPath;
    }

    const sourceDirPath = pathJoin(sourceFilePath, '..');
    const { dependencies } = getDependencies();
    const isDependencyImport = dependencies.includes(importPath);
    if (isDependencyImport) {
        const depPath = createDependencyPath(importPath);
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
