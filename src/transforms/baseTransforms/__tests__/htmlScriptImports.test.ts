import { transformHtmlScriptImports } from '../htmlScriptImports';

describe('transformHtmlScriptImports', () => {
    it('the transformation result should match a snapshot', async () => {
        const sourceFilePath = 'index.html';
        const textContent = '<script src="./main.js"></script>';

        const result = await transformHtmlScriptImports(
            sourceFilePath,
            textContent
        );

        expect(result).toMatchInlineSnapshot(
            `"<script type=\\"module\\" src=\\"./main.js\\"></script>"`
        );
    });
});
