const { open: openCypress } = require('cypress');
const { exec } = require('child_process');
const path = require('path');

const runExampleProject = async (configDraft) => {
    const cwdPath = process.cwd();
    const startExampleProjectScriptPath = path.join(
        cwdPath,
        './e2e/scripts/startExampleProject.js'
    );

    const argsString = Object.entries(configDraft)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ');

    const command = `node ${startExampleProjectScriptPath} ${argsString}`;
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

const exampleProjectConfig = {
    port: 3000,
    eventSourcePath: '__reload__',
};

runExampleProject(exampleProjectConfig).then(() => {
    openCypress({
        project: './e2e',
        config: {
            baseUrl: `http://localhost:${exampleProjectConfig.port}/`,
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
