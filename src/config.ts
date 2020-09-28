let config = {
    cwd: '',
    entryDir: '',
    port: 3000,
    eventSourcePath: '__reload__',
};

export const getConfig = () => config;

export const setConfig = (update: Partial<typeof config>) => {
    config = {
        ...config,
        ...update,
    };
};
