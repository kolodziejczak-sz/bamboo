import { createReadStream } from '../../utils';
import { write, getRequestPath, send404, sendFile, sendTextAsFile } from '../helpers';
import { createMockReq, createMockRes } from './utils';

jest.mock('../utils', () => ({
    createReadStream: () => ({ pipe: jest.fn() }),
    getFileSize: 20,
}));

describe('Http helpers', () => {

    it('getRequestPath', () => {
        const mockReq = createMockReq('home');
        const result = getRequestPath(mockReq);

        expect(result).toBe('home')
    });

    it('sendTextAsFile', () => {
        const mockRes = createMockRes();
        const fileName = 'index.js';
        const textContent = '';
    
        sendTextAsFile(mockRes, fileName, textContent);

        expect((mockRes.writeHead as jest.Mock).mock.calls).toMatchInlineSnapshot();
        expect((mockRes.end as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('sendFile', () => {
        const mockRes = createMockRes();
        const filePath = 'src/index.js';
    
        sendFile(mockRes, filePath);

        expect((createReadStream as jest.Mock).mock.calls).toMatchInlineSnapshot();
        expect((mockRes.writeHead as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('send404', () => {
        const mockRes = createMockRes();
        send404(mockRes);

        expect((mockRes.writeHead as jest.Mock).mock.calls).toMatchInlineSnapshot();
        expect((mockRes.end as jest.Mock).mock.calls).toMatchInlineSnapshot();

    });

    it('write', () => {
        const mockRes = createMockRes();
        const statusCode = 111;
        const headers = {};
        const partialChunk = 'partialChunk';
        const chunk = 'chunk';

        write({
            res: mockRes,
            statusCode,
            headers,
            partialChunk,
            chunk
        });

        expect(mockRes.writeHead).toBeCalledWith(statusCode, headers);
        expect(mockRes.write).toBeCalledWith(partialChunk);
        expect(mockRes.end).toBeCalledWith(chunk);
    })
})