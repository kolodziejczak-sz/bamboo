import { transform, Loader } from '../esbuild';
import { getConfig } from '../config';
import { pathExtension, pathRelative } from '../utils';

export const transformBabel = async (
    sourceFilePath: string,
    textContent: string
) => {
    const { entryDir } = getConfig();
    const loader = pathExtension(sourceFilePath).slice(1) as Loader;
    const { js } = await transform(textContent, {
        loader,
        sourcefile: pathRelative(entryDir, sourceFilePath),
        sourcemap: 'inline',
    });

    return js;
};
