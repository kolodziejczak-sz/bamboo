import { cache } from '../../cache';
import { setConfig } from '../../config';
import { notifyBrowser } from '../../httpServer';
import { transformFile, setupTransforms } from '../../transforms';
import { createWatcher } from '../createWatcher';
import { watch } from '../watch';

jest.mock('../watch', () => ({
    watch: jest.fn(({ onAdd, onChange, onDelete }) => ({
        onAdd: jest.fn((filePath: string) => onAdd(filePath)),
        onChange: jest.fn((filePath: string) => onChange(filePath)),
        onDelete: jest.fn((filePath: string) => onDelete(filePath)),
    })),
}));

jest.mock('../../transforms', () => ({
    ...jest.requireActual('../../transforms'),
    transformFile: jest.fn(() => 'transformed-file'),
}));

jest.mock('../../httpServer', () => ({
    notifyBrowser: jest.fn(),
}));

describe('watch', () => {
    const entryDirPath = 'root';
    setConfig({ entryDirPath });
    setupTransforms(() => [{ use: [() => ''], extensions: ['.js', '.html'] }]);

    beforeEach(() => {
        cache.clear();
        jest.clearAllMocks();
    });

    it('should call the watchFn with correct params', async () => {
        createWatcher();

        expect(watch).toBeCalledTimes(1);
        expect((watch as jest.Mock).mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "onAdd": [Function],
                  "onChange": [Function],
                  "onDelete": [Function],
                  "watchDirectory": "root",
                  "watchExtensions": Array [
                    ".js",
                    ".html",
                  ],
                },
              ],
            ]
        `);
    });

    it('should process a new file and notify the client about it', async () => {
        const watcher = createWatcher() as any;

        const newFilePath = `${entryDirPath}/bar.js`;
        await watcher.onAdd(newFilePath);

        expect(transformFile).toBeCalledTimes(1);
        expect(notifyBrowser).toBeCalledTimes(1);
        expect(Array.from(cache.entries())).toMatchInlineSnapshot(`
            Array [
              Array [
                "bar.js",
                "transformed-file",
              ],
            ]
        `);
    });

    it('should process a changed file and notify the client about it', async () => {
        const watcher = createWatcher() as any;

        const changedFilePath = `${entryDirPath}/bar.js`;
        await watcher.onChange(changedFilePath);

        expect(transformFile).toBeCalledTimes(1);
        expect(notifyBrowser).toBeCalledTimes(1);
        expect(Array.from(cache.entries())).toMatchInlineSnapshot(`
            Array [
              Array [
                "bar.js",
                "transformed-file",
              ],
            ]
        `);
    });

    it('should unstore a deleted file and notify the client about it', async () => {
        const cachedFile = 'foo.js';
        cache.set(cachedFile, 'cached-file');
        const watcher = createWatcher() as any;

        const deletedFilePath = `${entryDirPath}/${cachedFile}`;
        await watcher.onDelete(deletedFilePath);
        expect(notifyBrowser).toBeCalledTimes(1);

        expect(Array.from(cache.entries())).toMatchInlineSnapshot(`Array []`);
    });
});
