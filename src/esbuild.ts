import { startService, Service, TransformOptions } from 'esbuild';
import { createTextDecoder, onDestroy } from './utils';

export { Loader } from 'esbuild';

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

export const transform = async (input: string, options: TransformOptions) => {
    const service = await ensureService();
    return await service.transform(input, options);
};

export const bundle = async (
    entryPointPath: string,
    external: string[]
): Promise<string> => {
    const { build } = await ensureService();
    const { outputFiles } = await build({
        entryPoints: [entryPointPath],
        write: false,
        minify: true,
        bundle: true,
        format: 'esm',
        external,
    });
    const uint8ArrayContent = outputFiles[0].contents;
    const outputString = decoder.decode(uint8ArrayContent);

    return outputString;
};

onDestroy(stopService);
