import { buildDependencies } from './dependencies';
import { createServer } from './server';
import { getConfig, setConfig } from './config';

export const start = (configDraft) => {
    setConfig(configDraft);

    const { port } = getConfig();
    const httpServer = createServer();

    buildDependencies().then(() => {
        httpServer.listen(port);
    });
};
