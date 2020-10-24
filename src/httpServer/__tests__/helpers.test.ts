import { createReadStream } from '../../utils';
import {
    getRequestPath,
    send,
    send404,
    sendFile,
    sendTextAsFile,
} from '../helpers';
import { createMockRes, createMockReq } from './utils';

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    createReadStream: jest.fn(),
    getFileSize: () => 20,
}));

describe('Http helpers', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getRequestPath', () => {
        const mockReq = createMockReq('home');
        const result = getRequestPath(mockReq);

        expect(result).toBe('home');
    });

    it('sendTextAsFile', () => {
        const mockRes = createMockRes();
        const fileName = 'index.js';
        const textContent = '';

        sendTextAsFile(mockRes, fileName, textContent);

        expect((mockRes.writeHead as jest.Mock).mock.calls)
            .toMatchInlineSnapshot(`
            Array [
              Array [
                200,
                Object {
                  "Cache-Control": "no-cache",
                  "Content-Length": 0,
                  "Content-Type": "application/javascript",
                },
              ],
            ]
        `);

        expect(mockRes.end).toBeCalledWith(textContent);
    });

    it('sendFile', () => {
        const filePath = 'src/index.js';
        const mockRes = createMockRes();
        const mockedReadStream = { pipe: jest.fn() };
        (createReadStream as jest.Mock).mockImplementation(
            () => mockedReadStream
        );

        sendFile(mockRes, filePath);

        expect(createReadStream).toBeCalledTimes(1);
        expect(createReadStream).toBeCalledWith(filePath);
        expect(mockedReadStream.pipe).toBeCalledTimes(1);
        expect(mockedReadStream.pipe).toBeCalledWith(mockRes);

        expect((mockRes.writeHead as jest.Mock).mock.calls)
            .toMatchInlineSnapshot(`
            Array [
              Array [
                200,
                Object {
                  "Cache-Control": "no-cache",
                  "Content-Length": 20,
                  "Content-Type": "application/javascript",
                },
              ],
            ]
        `);
    });

    it('send404', () => {
        const mockRes = createMockRes();
        send404(mockRes);

        expect((mockRes.writeHead as jest.Mock).mock.calls)
            .toMatchInlineSnapshot(`
            Array [
              Array [
                404,
                Object {
                  "Content-Type": "text/plain",
                },
              ],
            ]
        `);
        expect(mockRes.end).toBeCalledTimes(1);
    });

    it('send', () => {
        const mockRes = createMockRes();
        const statusCode = 111;
        const headers = {};
        const partialChunk = 'partialChunk';
        const chunk = 'chunk';

        send({
            res: mockRes,
            statusCode,
            headers,
            partialChunk,
            chunk,
        });

        expect(mockRes.writeHead).toBeCalledWith(statusCode, headers);
        expect(mockRes.write).toBeCalledWith(partialChunk);
        expect(mockRes.end).toBeCalledWith(chunk);
    });
});
