export const transformHtmlScriptImports = async (
    sourceFilePath: string,
    textContent: string
) => {
    const scriptImportRegex = /<script([\s\S]*)?>([\s\S]*?)<\/script>/gi;
    const typeAttrRegex = /type\s*=\s*["|'][a-z\-\.\/]*["|']/;

    return textContent.replace(
        scriptImportRegex,
        (fullMatch: string, attrs: string, innerCode: string) => {
            const parsedAttrs = attrs.trim().replace(typeAttrRegex, '');
            const newAttrs = ['type="module"', parsedAttrs].join(' ');

            return `<script ${newAttrs}>${innerCode}</script>`;
        }
    );
};
