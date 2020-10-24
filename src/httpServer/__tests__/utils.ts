export const createMockReq = (url: string = '/'): any => ({
    on: jest.fn((eventName: string) => {}),
    url: '/' + url,
});

export const createMockRes = (): any => ({
    end: jest.fn(() => {}),
    write: jest.fn((text: string) => {}),
    writeHead: jest.fn((statusCode: number, headers: any) => {}),
});
