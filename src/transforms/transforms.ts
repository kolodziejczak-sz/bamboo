import { getConfig } from '../config';
import { pathExtension } from '../utils';
import { baseTransforms } from './baseTransforms';

type TransformFunction = (
    sourceFilePath: string,
    textContent: string
) => Promise<string> | string;

type TransformsCreatorFunction = (baseTransforms: Transform[]) => Transform[];

interface Transform {
    extensions: string[];
    use: TransformFunction[];
}

let transforms: Transform[] | undefined;
let extensionsToTransform: string[] | undefined;

export const getTransforms = () => {
    return transforms || [];
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

export const setupTransforms = (
    transformsCreatorFunction: TransformsCreatorFunction = getConfig()
        .transformsCreatorFunction
) => {
    transforms = transformsCreatorFunction(baseTransforms);
    extensionsToTransform = undefined;
};

export const runTransforms = async (
    sourceFilePath: string,
    textContent: string
) => {
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
