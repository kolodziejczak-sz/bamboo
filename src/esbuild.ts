import { Loader, startService, Service } from 'esbuild';
import { getConfig } from './config';
import { createTextDecoder, onDestroy, pathExtension } from './utils';

export { BuildOptions, TransformOptions } from 'esbuild';

let servicePromise: Promise<Service> | undefined;
const decoder = createTextDecoder();

const ensureService = async () => {
    if (!servicePromise) {
        servicePromise = startService();
    }
    return servicePromise;
};

const stopService = async () => {
    if (servicePromise) {
        const service = await servicePromise;
        service.stop();
        servicePromise = undefined;
    }
};

export const transform = async (
    sourceFile: string,
    textContent: string,
    customTransformOptions = getConfig().transformOptions
) => {
    const loader = pathExtension(sourceFile).slice(1) as Loader;
    const service = await ensureService();

    const { js: outputString } = await service.transform(textContent, {
        loader,
        sourcefile: sourceFile,
        sourcemap: 'inline',
        ...customTransformOptions,
    });

    return outputString;
};

export const bundle = async (
    entryPointPath: string,
    external: string[],
    customBuildOptions = getConfig().buildOptions
): Promise<string> => {
    const { build } = await ensureService();

    const { outputFiles } = await build({
        entryPoints: [entryPointPath],
        write: false,
        minify: true,
        bundle: true,
        format: 'esm',
        external,
        ...customBuildOptions,
    });
    const uint8ArrayContent = outputFiles[0].contents;
    const outputString = decoder.decode(uint8ArrayContent);

    return outputString;
};

onDestroy(stopService);
