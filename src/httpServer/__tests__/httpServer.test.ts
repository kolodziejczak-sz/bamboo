import { write, send404, sendFile, sendTextAsFile, getRequestPath } from '../helpers';
import { createHttpServer } from '../createHttpServer';
import { setConfig } from '../../config';
import { cache } from '../../cache';
import * as utils from '../../utils';
import { transformFile } from '../../transforms';
import { createMockReq, createMockRes, createMockHttpServer } from './utils';

jest.mock('http', () => ({
    createServer: createMockHttpServer,
}))

jest.mock('../../transform', () => ({
    transformFile: jest.fn(),
    getExtenstions: () => true
}))

jest.mock('../helpers', () => ({
    write: jest.fn(),
    sendTextAsFile: jest.fn(),
    send404: jest.fn(),
    sendFile: jest.fn(),
}))

describe('Create http server', () => {

    let httpServer;
    let notifyBrowser;
    const config = {
        port: 3000,
        eventSourcePath: 'sse',
    };

    beforeEach(() => {
        cache.clear();
        write.clearMock();
        sendTextAsFile.clearMock();
        httpServer = undefined;
        notifyBrowser = undefined;
        setConfig(config);
        const { httpServer: server, notifyBrowser: sse } = createHttpServer();
        httpServer = server;
        notifyBrowser = sse;
    });

    it('server initialization', () => {
        expect(httpServer.listen).toBeCalledWith(config.port);
        expect(notifyBrowser).not.toBeFalsy();
    });

    it('server sent events', () => {
        const mockReq = createMockReq(config.eventSourcePath);
        const mockRes = createMockRes();

        httpServer.requestListener(mockReq, mockRes);
        notifyBrowser({ message: '' });
        
        expect((write as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('response from cache', () => {
        const cacheKey = 'xxxx';
        const cacheValue = 'yyyy';
        cache.set(cacheKey, cacheValue)
        const mockReq = createMockReq(cacheKey);
        const mockRes = createMockRes();

        httpServer.requestListener(mockReq, mockRes);
        
        expect((sendTextAsFile as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('404 as response', () => {
        const mockReq = createMockReq('pathWithExtension.mp3');
        const mockRes = createMockRes();
        Object.assign(utils, { pathExists: () => false })

        httpServer.requestListener(mockReq, mockRes);
        
        expect((send404 as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('file as response', () => {
        const mockReq = createMockReq('pathWithExtension.mp3');
        const mockRes = createMockRes();
        Object.assign(utils, { pathExists: () => true })

        httpServer.requestListener(mockReq, mockRes);
        
        expect((sendFile as jest.Mock).mock.calls).toMatchInlineSnapshot();
    });

    it('transformFile as response', () => {
        const mockReq = createMockReq('pathWithExtension.mp3');
        const mockRes = createMockRes();
        Object.assign(utils, { pathExists: () => true })

        httpServer.requestListener(mockReq, mockRes);
        
        expect((sendTextAsFile as jest.Mock).mock.calls).toMatchInlineSnapshot();
        expect(cache.entries).toMatchInlineSnapshot();
    });
});