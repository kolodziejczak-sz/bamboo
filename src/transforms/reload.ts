import { appendToString } from '../utils';
import { getConfig } from '../config';

const getScriptToInject = (eventSourcePath) => `
    <!-- The script below reloads page on file change. --> 
    <script>
        const evtSource = new EventSource('${eventSourcePath}');
        evtSource.onmessage = () => {
            evtSource.close();
            location.reload();
        }
    </script>
`;

export const injectReloadScript = async (
    sourceFilePath: string,
    textContent: string
) => {
    const { eventSourcePath } = getConfig();
    const scriptToInject = getScriptToInject(eventSourcePath);
    const targetIndex =
        Math.max(0, textContent.indexOf('</body>')) ||
        Math.max(0, textContent.indexOf('</html>')) ||
        textContent.length;

    return appendToString(textContent, scriptToInject, targetIndex);
};
