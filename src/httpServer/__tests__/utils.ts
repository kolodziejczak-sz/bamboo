import { IncomingMessage, ServerResponse } from 'http';

export const createMockReq = (url: string = '/') => {
    const on = (eventName: string) => {};

    return {
        on: jest.fn(on),
        url: '/' + url,
    } as IncomingMessage;
};

export const createMockRes = () => {
    const write = (text: string) => {};
    const writeHead = (statusCode: number, headers: any) => {};
    const end = () => {};

    return {
        write: jest.fn(write),
        writeHead: jest.fn(writeHead),
        end: jest.fn(end),
    } as ServerResponse;
};

export const createMockHttpServer = (requestListener: () => void) => {
    const listen = (port: number) => {};
    const close = () => {};
    
    return {
        listen: jest.fn(listen),
        close: jest.fn(close),
        requestListener: jest.fn(requestListener),
    }
}
