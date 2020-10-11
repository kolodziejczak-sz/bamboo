import { transformBabel } from '../babel';
import { transform } from '../../esbuild';

jest.mock('../../esbuild', () => ({
    transform: jest.fn(() => ({ js: '' })),
}));

describe('transformBabel', () => {
    it('should call esbuild transform with correct params', async () => {
        const sourceFilePath = 'index.ts';
        const textContent = '';

        await transformBabel(sourceFilePath, textContent);

        expect(transform).toBeCalledTimes(1);
        expect(transform).toBeCalledWith(textContent, {
            loader: 'ts',
            sourcefile: sourceFilePath,
            sourcemap: 'inline',
        });
    });
});
