import { buildDependencies } from './dependencies';
import { createServer } from './createServer';
import { getConfig, setConfig } from './config';

export const start = (configDraft) => {
    setConfig(configDraft);

    const { port } = getConfig();
    const httpServer = createServer();

    buildDependencies().then(() => {
        httpServer.listen(port);
    });
};

// append to every html file

// const prepareScript = (port) => `
//     <script>
//         const evtSource = new EventSource('_watch');
//         evtSource.onmessage = () => location.reload();
//     </script>
// `;
