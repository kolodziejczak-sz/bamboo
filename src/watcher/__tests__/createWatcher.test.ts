import { cache } from '../../cache';
import { setConfig } from '../../config';
import { notifyBrowser } from '../../httpServer';
import { setupTransforms } from '../../transforms';
import { createWatcher } from '../createWatcher';
import { watch } from '../watch';

jest.mock('../watch', () => ({
    watch: jest.fn(({ onFilesChange }) => ({
        onFilesChange: jest.fn((filePath: string) => onFilesChange(filePath)),
    })),
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
                  "onFilesChange": [Function],
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

    it('should notify user only when a modified file was cached', async () => {
        const watcher = createWatcher() as any;
        cache.set('non-empty-cache', 'cached-file');

        const changedFilePath = 'foo.zip';
        await watcher.onFilesChange(changedFilePath);

        expect(notifyBrowser).toBeCalledTimes(0);
        expect(cache.size).toBe(1);
    });

    it('should uncache modified file and notify the client about it', async () => {
        const cachedFile = 'foo.js';
        cache.set(cachedFile, 'cached-file');
        const watcher = createWatcher() as any;

        const changedFilePath = `${entryDirPath}/${cachedFile}`;
        await watcher.onFilesChange(changedFilePath);
        expect(notifyBrowser).toBeCalledTimes(1);
        expect(cache.size).toBe(0);
    });
});
