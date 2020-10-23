import { setConfig } from '../../../config';
import { pathExists } from '../../../utils';
import { transformEsImports } from '../esImports';

jest.mock('../../../utils', () => ({
    ...jest.requireActual('../../../utils'),
    pathExists: jest.fn(() => false),
}));

describe('transformEsImports', () => {
    const entryDirPath = 'root/project/';
    const existingPaths = [
        `${entryDirPath}store`,
        `${entryDirPath}store/index.ts`,
        `${entryDirPath}store/reducer.js`,
    ];

    setConfig({ entryDirPath });
    (pathExists as jest.Mock).mockImplementation((path: string) =>
        existingPaths.includes(path)
    );

    it('the transformation result should match a snapshot', async () => {
        const sourceFilePath = 'index.ts';
        const textContent = `
            import { createStore } from './store';
            import './styles.css';

            const rootReducer = import('./store/reducer');
        `;

        const result = await transformEsImports(sourceFilePath, textContent);

        expect(result).toMatchInlineSnapshot(`
            "
                        import { createStore } from './store/index.ts';
                        import './styles.css';

                        const rootReducer = import('./store/reducer.js');
                    "
        `);
    });
});
