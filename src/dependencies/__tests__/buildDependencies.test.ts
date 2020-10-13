import * as buildDependencies from '../buildDependencies';
import * as dependencies from '../dependencies';
import * as cache from '../../cache';
import { setConfig } from '../../config';

const mockedCache = { set: jest.fn(() => {}) };
const mockedDependencies = ['foo', 'bar'];
const dependenciesCount = mockedDependencies.length;
const mockedBuiltInModules = [];
const mockedStringifyDependency = jest.fn(
    (depName) => `stringified ${depName}`
);

Object.assign(cache, {
    cache: mockedCache,
});
Object.assign(dependencies, {
    getDependencies: () => ({ dependencies: mockedDependencies }),
    getBuiltInModules: () => mockedBuiltInModules,
    stringifyDependency: mockedStringifyDependency,
});

describe('buildDependencies', () => {
    const projectRootPath = 'root/project';

    beforeAll(() => {
        setConfig({ projectRootPath });
        mockedCache.set.mockClear();
    });

    it('should call stringify dependency and store result in cache', async () => {
        await buildDependencies.buildDependencies();

        expect(mockedCache.set).toHaveBeenCalledTimes(dependenciesCount);
        expect(mockedStringifyDependency).toHaveBeenCalledTimes(
            dependenciesCount
        );
        expect(mockedCache.set.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "bundled_node_modules/foo.js",
                "stringified root/project/node_modules/foo",
              ],
              Array [
                "bundled_node_modules/bar.js",
                "stringified root/project/node_modules/bar",
              ],
            ]
        `);
        expect(mockedStringifyDependency.mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                "root/project/node_modules/foo",
              ],
              Array [
                "root/project/node_modules/bar",
              ],
            ]
        `);
    });
});
