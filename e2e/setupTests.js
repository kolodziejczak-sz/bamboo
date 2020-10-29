const { open: openCypress } = require('cypress');
const { exec } = require('child_process');
const path = require('path');

const runExampleProject = async (port) => {
    const cwdPath = process.cwd();
    const exampleProjectPath = path.join(cwdPath, './e2e/exampleProject');

    const command = `bamboo -r ${exampleProjectPath} -d src -p ${port}`;
    const childProcess = exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });

    return () => childProcess.kill();
};

const exampleProjectPort = 3000;

runExampleProject(exampleProjectPort).then(() => {
    openCypress({
        project: './e2e',
        config: {
            baseUrl: `http://localhost:${exampleProjectPort}/`,
            experimentalNetworkStubbing: true,
            fixturesFolder: './fixtures',
            integrationFolder: './specs',
            pluginsFile: './plugins/index.ts',
            screenshotOnRunFailure: false,
            supportFile: './support/index.ts',
            video: false,
        },
    });
});
