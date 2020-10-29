import { cache } from '../../cache';
import { setConfig } from '../../config';
import { getExtensionsToTransform, transformFile } from '../../transforms';
import { pathExists } from '../../utils';
import { createHttpServer } from '../createHttpServer';
import { notifyBrowser } from '../serverSentEvents';
import { send, send404, sendFile, sendTextAsFile } from '../helpers';
import { createMockRes, createMockReq } from './utils';

jest.mock('http', () => ({
    ...jest.requireActual('http'),
    createServer: (requestListener: (req: any, res: any) => void) => ({
        listen: jest.fn((port: number) => {}),
        close: jest.fn(() => {}),
        requestListener: jest.fn(requestListener),
    }),
}));

jest.mock('../../transforms', () => ({
    ...jest.requireActual('../../transforms'),
    transformFile: jest.fn(),
    getExtensionsToTransform: jest.fn(),
}));

jest.mock('../../utils', () => ({
    ...jest.requireActual('../../utils'),
    pathExists: jest.fn(),
}));

jest.mock('../helpers', () => ({
    ...jest.requireActual('../helpers'),
    send: jest.fn(),
    send404: jest.fn(),
    sendFile: jest.fn(),
    sendTextAsFile: jest.fn(),
}));

describe('Create http server', () => {
    const createHttpMockedServer = () => createHttpServer() as any;

    const config = {
        projectRootPath: '',
        entryDirPath: '',
        port: 3000,
        eventSourcePath: 'sse',
    };

    beforeEach(() => {
        cache.clear();
        jest.clearAllMocks();
        setConfig(config);
    });

    it('server initialization', () => {
        const httpServer = createHttpMockedServer();

        expect(httpServer.listen).toBeCalledWith(config.port);
    });

    it('server sent events', async () => {
        const httpServer = createHttpMockedServer();
        const mockReq = createMockReq(config.eventSourcePath);
        const mockRes = createMockRes();

        await httpServer.requestListener(mockReq, mockRes);

        notifyBrowser();

        expect(send).toBeCalledTimes(2);
        expect((send as jest.Mock).mock.calls).toMatchInlineSnapshot(`
            Array [
              Array [
                Object {
                  "headers": Object {
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "Content-Type": "text/event-stream",
                  },
                  "res": Object {
                    "end": [MockFunction],
                    "write": [MockFunction],
                    "writeHead": [MockFunction],
                  },
                  "statusCode": 200,
                },
              ],
              Array [
                Object {
                  "partialChunk": "data:\\"\\"

            ",
                  "res": Object {
                    "end": [MockFunction],
                    "write": [MockFunction],
                    "writeHead": [MockFunction],
                  },
                },
              ],
            ]
        `);
    });

    it('response from cache', async () => {
        const cacheKey = 'xxxx';
        const cacheValue = 'yyyy';
        const httpServer = createHttpMockedServer();
        const mockReq = createMockReq(cacheKey);
        const mockRes = createMockRes();
        cache.set(cacheKey, cacheValue);

        await httpServer.requestListener(mockReq, mockRes);

        expect(sendTextAsFile).toBeCalledWith(mockRes, cacheKey, cacheValue);
    });

    it('404 as response', async () => {
        const httpServer = createHttpMockedServer();
        const mockReq = createMockReq('pathWithExtension.mp3');
        const mockRes = createMockRes();
        (pathExists as jest.Mock).mockImplementation(() => false);

        await httpServer.requestListener(mockReq, mockRes);

        expect(send404).toBeCalledTimes(1);
        expect(send404).toBeCalledWith(mockRes);
    });

    it('file as response', async () => {
        const httpServer = createHttpMockedServer();
        const fileName = 'file.mp3';
        const mockReq = createMockReq(fileName);
        const mockRes = createMockRes();
        (pathExists as jest.Mock).mockImplementation(() => true);
        (getExtensionsToTransform as jest.Mock).mockImplementation(() => []);

        await httpServer.requestListener(mockReq, mockRes);

        expect(sendFile).toBeCalledTimes(1);
        expect(sendFile).toBeCalledWith(mockRes, fileName);
    });

    it('transformFile as response', async () => {
        const supportedExtentsion = '.css';
        const fileName = `file${supportedExtentsion}`;
        const fileContent = 'css file content';
        const httpServer = createHttpMockedServer();
        const mockReq = createMockReq(fileName);
        const mockRes = createMockRes();
        (getExtensionsToTransform as jest.Mock).mockImplementation(() => [
            supportedExtentsion,
        ]);
        (pathExists as jest.Mock).mockImplementation(() => true);
        (transformFile as jest.Mock).mockImplementation(() => fileContent);

        await httpServer.requestListener(mockReq, mockRes);

        expect(sendTextAsFile).toBeCalledTimes(1);
        expect(sendTextAsFile).toBeCalledWith(mockRes, fileName, fileContent);
    });
});
