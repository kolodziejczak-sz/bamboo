import { scriptExtensions } from '../../utils';
import { transformBabel } from './babel';
import { transformEsImports } from './esImports';
import { transformHtmlScriptImports } from './htmlScriptImports';
import { injectReloadScript } from './reload';

export const baseTransforms = [
    {
        extensions: scriptExtensions,
        use: [transformBabel, transformEsImports],
    },
    {
        extensions: ['.html'],
        use: [transformHtmlScriptImports, injectReloadScript],
    },
];
