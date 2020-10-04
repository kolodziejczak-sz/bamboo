import pathModule from 'path';
import mime from 'mime-types';
import fs from 'fs-extra';
import slash from 'slash';
import exitHook from 'exit-hook';

export const scriptExtensions = ['.ts', '.tsx', '.js', '.jsx'];

export const normalizeSlashes = (path: string) => slash(path);

export const getMimeType = (ext: string) => {
    if (scriptExtensions.includes(ext)) {
        return 'application/javascript';
    }
    return mime.lookup(ext) as string;
};

export const getCwdPath = () => normalizeSlashes(process.cwd());

export const createReadStream = (path: string) => fs.createReadStream(path);

export const getFileSize = (path: string) => {
    const { size } = fs.statSync(path);
    return size;
};

export const readFileAsText = async (path: string) =>
    fs.readFile(path, 'utf-8');

export const parsePackageJson = (path: string) => require(path);

export const pathResolve = (...paths: string[]) =>
    normalizeSlashes(pathModule.resolve(...paths));

export const pathJoin = (...paths: string[]) =>
    normalizeSlashes(pathModule.join(...paths));

export const pathRelative = (from: string, to: string) =>
    `./${normalizeSlashes(pathModule.relative(from, to))}`;

export const pathExists = (path: string) => fs.existsSync(path);

export const pathExtension = (path: string) => pathModule.extname(path);

export const appendToString = (text: string, subText: string, index: number) =>
    text.slice(0, index) + subText + text.slice(index);

export const onDestroy = (op: () => void) => exitHook(op);
