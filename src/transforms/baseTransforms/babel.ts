import { transform } from '../../esbuild';

export const transformBabel = async (
    sourceFilePath: string,
    textContent: string
) => {
    const transformedTextContent = await transform(sourceFilePath, textContent);

    return transformedTextContent;
};
