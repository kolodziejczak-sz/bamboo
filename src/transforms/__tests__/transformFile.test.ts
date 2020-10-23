import { setConfig } from '../../config';
import { runTransforms } from '../transforms';
import { readFileAsText } from '../../utils';
import { transformFile } from '../transformFile';

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    readFileAsText: jest.fn(() => {}),
}));

jest.mock('../transforms', () => ({
    ...jest.requireActual('../transforms'),
    runTransforms: jest.fn(() => {}),
}));

describe('transformFile', () => {
    it('should call runTransforms fn with relativePath', async () => {
        const entryDirPath = 'root/project/';
        const fileRelativePath = 'src/main.html';
        const fileFullPath = `${entryDirPath}${fileRelativePath}`;
        const fileTextContent = `<html></html>`;
        const mockedRunTransforms = jest.fn(() => 'any');
        (readFileAsText as jest.Mock).mockImplementation(() => fileTextContent);
        (runTransforms as jest.Mock).mockImplementation(mockedRunTransforms);
        setConfig({ entryDirPath });

        await transformFile(fileFullPath);

        expect(mockedRunTransforms).toBeCalledTimes(1);
        expect(mockedRunTransforms).toBeCalledWith(
            fileRelativePath,
            fileTextContent
        );
    });
});
