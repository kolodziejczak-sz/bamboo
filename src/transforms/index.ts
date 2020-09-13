import { transformBabel } from './babel';
import { transformEsImports } from './esImports';

const transforms = [
    { test: /\.(ts|js|tsx|jsx)$/, use: [transformBabel, transformEsImports] },
];

export const runTransforms = async (
    sourceFilePath: string,
    textContent: string
) => {
    for (let { test, use } of transforms) {
        if (test.test(sourceFilePath)) {
            for (let transformFn of use) {
                textContent = await transformFn(sourceFilePath, textContent);
            }
        }
    }

    return textContent;
};
