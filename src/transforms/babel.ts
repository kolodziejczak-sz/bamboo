import { transform, Loader } from '../esbuildService';
import { pathExtension } from '../utils';

export const transformBabel = async (
    sourceFilePath: string,
    textContent: string
) => {
    const loader = pathExtension(sourceFilePath).slice(1) as Loader;
    const { js } = await transform(textContent, {
        loader,
        sourcefile: sourceFilePath,
        sourcemap: 'inline',
    });

    return js;
};
