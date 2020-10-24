import { watch } from '../watch';

jest.mock('chokidar', () => {
    const obj = {
        watch: jest.fn(() => obj),
        on: jest.fn(() => obj),
        close: jest.fn(),
    };

    return obj;
});

describe('watch', () => {
    it('should create chokiddar instance', async () => {
        const onFilesChange = jest.fn();

        const watcher = watch({
            onFilesChange,
            watchDirectory: 'watchDirectory',
            watchExtensions: ['.ts', '.js'],
        }) as any;

        expect(watcher.on).toBeCalledTimes(2);
        expect(watcher.on).toBeCalledWith('change', onFilesChange);
        expect(watcher.on).toBeCalledWith('unlink', onFilesChange);

        const chokidar = watcher.watch;
        expect(chokidar).toBeCalledTimes(1);
        expect(chokidar.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Array [
                  "watchDirectory/**/*.ts",
                  "watchDirectory/**/*.js",
                ],
                Object {
                  "ignoreInitial": true,
                  "ignored": Array [
                    "**/node_modules/**",
                  ],
                },
              ],
            ]
        `);
    });
});
