export const cache = new Map<string, string>();

export const withCacheLookup = <T extends any[]>(
    op: (...args: T) => Promise<string> | string,
    cacheKey: string
) => {
    const wrappedOp = async (...args: T) => {
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }

        const result = await op(...args);
        cache.set(cacheKey, result);

        return result;
    };

    return wrappedOp;
};
