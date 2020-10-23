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
        const watcherOptions = {
            onAdd: jest.fn(),
            onChange: jest.fn(),
            onDelete: jest.fn(),
            watchDirectory: 'watchDirectory',
            watchExtensions: ['.ts', '.js'],
        };
        const watcher = watch(watcherOptions) as any;

        expect(watcher.on).toBeCalledTimes(3);
        expect(watcher.on).toBeCalledWith('add', watcherOptions.onAdd);
        expect(watcher.on).toBeCalledWith('change', watcherOptions.onChange);
        expect(watcher.on).toBeCalledWith('unlink', watcherOptions.onDelete);

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
