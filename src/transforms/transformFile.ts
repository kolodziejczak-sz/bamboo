import { getRelativePath } from '../config';
import { readFileAsText } from '../utils';
import { runTransforms } from './transforms';

export const transformFile = async (fileFullPath: string): Promise<string> => {
    const fileRelativePath = getRelativePath(fileFullPath);
    const textContent = await readFileAsText(fileFullPath);
    const transformedTextContent = await runTransforms(
        fileRelativePath,
        textContent
    );

    return transformedTextContent;
};
