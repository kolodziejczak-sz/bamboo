import { appendToString } from '../utils';
import { getConfig } from '../config';

const getScriptToInject = (eventSourcePath) => `
    <script>
        const evtSource = new EventSource('${eventSourcePath}');
        evtSource.onmessage = (message) => console.log(message);
    </script>
`;

export const injectReloadScript = async (
    sourceFilePath: string,
    textContent: string
) => {
    const { eventSourcePath } = getConfig();
    const scriptToInject = getScriptToInject(eventSourcePath);
    const targetIndex =
        textContent.indexOf('</body>') ||
        textContent.indexOf('</html>') ||
        textContent.length;

    return appendToString(textContent, scriptToInject, targetIndex);
};
