import { startService, Service, TransformOptions, BuildOptions } from 'esbuild';
import { onDestroy } from './utils';
export { Loader } from 'esbuild';

let servicePromise: Promise<Service> | undefined;

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

export const build = async (options: BuildOptions) => {
    const service = await ensureService();
    return await service.build(options);
};

onDestroy(stopService);
