import { getConfig, setConfig, Config } from './config';
import { buildDependencies } from './dependencies';
import { createHttpServer } from './httpServer';
import { setupTransforms } from './transforms';
import { createWatcher } from './watcher';

export const start = async (configDraft: Partial<Config>) => {
    setConfig(configDraft);

    const { transformsCreatorFunction } = getConfig();
    setupTransforms(transformsCreatorFunction);

    await buildDependencies();
    const { notifyBrowser } = await createHttpServer();
    await createWatcher(notifyBrowser);
};
