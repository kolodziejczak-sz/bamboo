/// <reference path="../support/index.d.ts" />

describe('Example project: browser', () => {
    it('Should fetch all necessary files and print out a script result to the console.', () => {
        const httpRequestsUrls = [];
        const baseUrl = Cypress.config('baseUrl');

        cy.route2('**', (req) => {
            httpRequestsUrls.push(req.url);
            req.reply();
        });

        cy.visit(baseUrl);

        cy.waitForConsoleLog().then((args) => {
            cy.wrap(httpRequestsUrls).snapshot({ name: 'http requests' });
            cy.wrap(args).snapshot({ name: 'script result' });
        });
    });
});
