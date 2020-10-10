require('@cypress/snapshot').register();

let onConsoleLog: ((...args: any[]) => void) | undefined;

Cypress.on('window:before:load', (window) => {
    const defaultConsoleLog = window.console.log;
    window.console.log = (...args: any[]) => {
        onConsoleLog?.(...args);
        defaultConsoleLog(...args);
    };
});

Cypress.Commands.add('waitForConsoleLog', ({ timeout = 1000 } = {}) => {
    return new Promise((resolve, reject) => {
        onConsoleLog = (...args: any[]) => resolve(args);
        setTimeout(reject, timeout);
    });
});
