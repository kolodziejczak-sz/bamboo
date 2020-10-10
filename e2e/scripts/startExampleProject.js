const path = require('path');

const cwdPath = process.cwd();
const toolPath = path.join(cwdPath, './dist/index');
const exampleProjectPath = path.join(cwdPath, './e2e/exampleProject');
const { start } = require(toolPath);

const startExampleProject = (config) => {
    start({
        projectRootPath: exampleProjectPath,
        entryDirPath: path.resolve(exampleProjectPath, 'src'),
        ...config,
    });
};

const customArgs = process.argv.slice(2);
const parsedCustomArgs = customArgs
    .map((arg) => arg.split('='))
    .reduce((stack, [key, value]) => ({ ...stack, [key]: value }), {});

const configDraft = parsedCustomArgs;

startExampleProject(configDraft);
