import { cache } from '../../cache';
import { setConfig } from '../../config';
import { buildDependencies } from '../buildDependencies';
import { getDependencies, stringifyDependency } from '../dependencies';

jest.mock('../dependencies', () => ({
    __esModule: true,
    ...jest.requireActual('../dependencies'),
    getDependencies: jest.fn(),
    stringifyDependency: jest.fn((depPath) => `stringified ${depPath}`),
}));

describe('buildDependencies', () => {
    setConfig({ projectRootPath: 'root/project' });

    beforeAll(() => {
        cache.clear();
        jest.clearAllMocks();
    });

    it('should call stringify dependency and store result in cache', async () => {
        const mockedDependencies = ['foo', 'bar'];
        const dependenciesCount = mockedDependencies.length;
        (getDependencies as jest.Mock).mockImplementation(() => ({
            dependencies: mockedDependencies,
        }));

        expect(cache.size).toBe(0);

        await buildDependencies();

        expect(stringifyDependency).toHaveBeenCalledTimes(dependenciesCount);
        expect(cache.size).toBe(dependenciesCount);

        expect(Array.from(cache.entries())).toMatchInlineSnapshot(`
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
    });
});
