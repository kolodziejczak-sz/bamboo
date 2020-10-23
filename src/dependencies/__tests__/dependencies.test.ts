import { parsePackageJson } from '../../utils';
import { build } from '../../esbuild';
import {
    getDependencies,
    isDependency,
    stringifyDependency,
} from '../dependencies';

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    parsePackageJson: jest.fn(() => ({})),
}));

jest.mock('../../esbuild', () => ({
    ...jest.requireActual('../../esbuild'),
    build: jest.fn(({ entryPoints }) => ({
        outputFiles: [{ contents: Uint8Array.from(entryPoints[0]) }],
    })),
}));

jest.mock('builtin-modules', () => []);

describe('dependencies', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('getDependencies', async () => {
        expect(getDependencies()).toEqual(undefined);
        expect(getDependencies('any')).toMatchInlineSnapshot(`
            Object {
              "dependencies": Array [],
              "devDependencies": Array [],
              "peerDependencies": Array [],
            }
        `);
    });

    it('isDependency', async () => {
        (parsePackageJson as jest.Mock).mockImplementation(() => ({
            dependencies: { foo: '1.0', bar: '2.0' },
        }));

        const { dependencies } = getDependencies('any');

        expect(isDependency('baz')).toBe(false);
        expect(dependencies.map(isDependency).every(Boolean)).toBe(true);
    });

    it('stringify dependency', async () => {
        const packageName = 'foo';
        const packagePath = `node_modules/${packageName}`;

        const result = await stringifyDependency(packagePath);

        expect(typeof result).toEqual('string');
        expect((build as jest.Mock).mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "bundle": true,
                  "entryPoints": Array [
                    "node_modules/foo/index.js",
                  ],
                  "external": Array [],
                  "format": "esm",
                  "minify": true,
                  "write": false,
                },
              ],
            ]
        `);
    });
});
