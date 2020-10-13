import { setConfig } from '../../config';
import * as utils from '../../utils';
import * as transforms from '../transforms';
import { transformFile } from '../transformFile';

describe('transformFile', () => {
    it('should call runTransforms fn with relativePath', async () => {
        const entryDirPath = 'root/project/';
        const fileRelativePath = 'src/main.html';
        const fileFullPath = `${entryDirPath}${fileRelativePath}`;
        const fileTextContent = `<html></html>`;
        const mockedRunTransforms = jest.fn(() => 'any');
        Object.assign(utils, { readFileAsText: () => fileTextContent });
        Object.assign(transforms, { runTransforms: mockedRunTransforms });
        setConfig({ entryDirPath });

        await transformFile(fileFullPath);

        expect(mockedRunTransforms).toBeCalledTimes(1);
        expect(mockedRunTransforms).toBeCalledWith(
            fileRelativePath,
            fileTextContent
        );
    });
});
