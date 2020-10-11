import { setConfig } from '../../config';
import * as utils from '../../utils';
import {
    getExtensionsToTransform,
    getTransforms,
    setupTransforms,
    transformFile,
} from '../index';

describe('transforms runner', () => {
    const resetTransformModule = () => setupTransforms(() => undefined);
    beforeEach(resetTransformModule);
    afterEach(resetTransformModule);

    const entryDirPath = 'root/project/';
    const fileRelativePath = 'src/main.html';
    const fileFullPath = `${entryDirPath}${fileRelativePath}`;
    const fileContent = `<html></html>`;
    const transformedFileContent = `any`;
    Object.assign(utils, {
        readFileAsText: () => fileContent,
    });
    const firstCustomTransform = jest.fn(() => transformedFileContent);
    const secondCustomTransform = jest.fn(() => transformedFileContent);
    const customTransforms = [
        {
            extensions: ['.html'],
            use: [firstCustomTransform, secondCustomTransform],
        },
    ];

    setConfig({ entryDirPath });

    it('should run all transforms over the file', async () => {
        expect(getTransforms()).toEqual([]);
        expect(getExtensionsToTransform()).toEqual([]);
        expect(await transformFile(fileFullPath)).toEqual(fileContent);
        expect(firstCustomTransform).toBeCalledTimes(0);
        expect(secondCustomTransform).toBeCalledTimes(0);

        setupTransforms((baseTransforms) => {
            expect(baseTransforms).toBeDefined();
            return customTransforms;
        });

        expect(getTransforms()).toEqual(customTransforms);
        expect(getExtensionsToTransform()).toEqual(
            customTransforms[0].extensions
        );
        expect(await transformFile(fileFullPath)).toEqual(
            transformedFileContent
        );
        expect(firstCustomTransform).toBeCalledTimes(1);
        expect(secondCustomTransform).toBeCalledTimes(1);
        expect(firstCustomTransform).toBeCalledWith(
            fileRelativePath,
            fileContent
        );
        expect(secondCustomTransform).toBeCalledWith(
            fileRelativePath,
            transformedFileContent
        );
    });
});
