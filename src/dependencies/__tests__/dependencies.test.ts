import * as utils from '../../utils';
import * as esbuild from '../../esbuild';
import {
    getDependencies,
    isDependency,
    stringifyDependency,
} from '../dependencies';

jest.mock('builtin-modules', () => []);

describe('dependencies', () => {
    it('getDependencies', async () => {
        Object.assign(utils, { parsePackageJson: () => ({}) });

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
        Object.assign(utils, {
            parsePackageJson: () => ({
                dependencies: { foo: '1.0', bar: '2.0' },
            }),
        });
        const { dependencies } = getDependencies('any');

        expect(isDependency('baz')).toBe(false);
        expect(dependencies.map(isDependency).every(Boolean)).toBe(true);
    });

    it('stringify dependency', async () => {
        const mockedBuild = jest.fn(({ entryPoints }) => ({
            outputFiles: [
                {
                    contents: Uint8Array.from(
                        `stringified ${entryPoints[0]}` as any
                    ),
                },
            ],
        }));
        const mockedParsePackageJson = jest.fn(() => ({}));
        Object.assign(utils, { parsePackageJson: mockedParsePackageJson });
        Object.assign(esbuild, { build: mockedBuild });

        const packageName = 'foo';
        const packagePath = `node_modules/${packageName}`;

        const result = await stringifyDependency(packagePath);

        expect(typeof result).toEqual('string');
        expect(mockedBuild.mock.calls).toMatchInlineSnapshot(`
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
