import pathModule from 'path';
import mime from 'mime-types';
import fs from 'fs-extra';
import slash from 'slash';

export const scriptExtensions = ['.tsx', '.ts', '.js', '.jsx'];

export const getMimeType = (ext: string) => {
    if (scriptExtensions.includes(ext)) {
        return 'application/javascript';
    }
    return mime.lookup(ext) as string;
};

export const readFileAsText = async (path: string) =>
    fs.readFile(path, 'utf-8');

export const parsePackageJson = (path: string) => require(path);

export const pathResolve = (...paths: string[]) =>
    slash(pathModule.resolve(...paths));

export const pathJoin = (...paths: string[]) =>
    slash(pathModule.join(...paths));

export const pathRelative = (from: string, to: string) =>
    `./${slash(pathModule.relative(from, to))}`;

export const pathExists = (path: string) => fs.existsSync(path);

export const pathExtension = (path: string) => pathModule.extname(path);
