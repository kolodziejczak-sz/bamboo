import { pathExtension, scriptExtensions, readFileAsText } from '../utils';
import { getRelativePath } from '../config';
import { transformBabel } from './babel';
import { transformEsImports } from './esImports';
import { transformHtmlScriptImports } from './htmlScriptImports';
import { injectReloadScript } from './reload';

type TransformFunction = (
    sourceFilePath: string,
    textContent: string
) => Promise<string> | string;

interface Transform {
    extensions: string[];
    use: TransformFunction[];
}

let transforms: Transform[] | undefined;
let extensionsToTransform: string[] | undefined;

const baseTransforms: Transform[] = [
    {
        extensions: scriptExtensions,
        use: [transformBabel, transformEsImports],
    },
    {
        extensions: ['.html'],
        use: [transformHtmlScriptImports, injectReloadScript],
    },
];

export const setupTransforms = (additionalTransforms: Transform[] = []) => {
    transforms = [...baseTransforms, ...additionalTransforms];
    extensionsToTransform = undefined;
};

const getTransforms = () => {
    if (!transforms) setupTransforms();
    return transforms;
};

export const getExtensionsToTransform = () => {
    if (!extensionsToTransform) {
        const extensionsSet = new Set<string>();
        const transformsToLookup = getTransforms();

        transformsToLookup.forEach(({ extensions }) =>
            extensions.forEach((ext: string) => extensionsSet.add(ext))
        );

        extensionsToTransform = Array.from(extensionsSet);
    }

    return extensionsToTransform;
};

const runTransforms = async (sourceFilePath: string, textContent: string) => {
    const sourceFileExtension = pathExtension(sourceFilePath);
    const transformsToRun = getTransforms();

    for (let { extensions, use } of transformsToRun) {
        if (extensions.includes(sourceFileExtension)) {
            for (let transformFn of use) {
                textContent = await transformFn(sourceFilePath, textContent);
            }
        }
    }

    return textContent;
};

export const transformFile = async (fileFullPath: string): Promise<string> => {
    const fileRelativePath = getRelativePath(fileFullPath);
    const textContent = await readFileAsText(fileFullPath);
    const transformedTextContent = await runTransforms(
        fileRelativePath,
        textContent
    );

    return transformedTextContent;
};
