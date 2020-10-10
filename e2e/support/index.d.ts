/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable {
        waitForConsoleLog(options?: { timeout: number }): Promise<any[]>;
        snapshot(options?: { name: string }): void;
    }
}
