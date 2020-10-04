import { setConfig, Config } from './config';
import { buildDependencies } from './dependencies';
import { createHttpServer } from './httpServer';
import { createWatcher } from './watcher';

export const start = async (configDraft: Partial<Config>) => {
    setConfig(configDraft);
    await buildDependencies();
    const { notifyBrowser } = await createHttpServer();
    await createWatcher(notifyBrowser);
};
