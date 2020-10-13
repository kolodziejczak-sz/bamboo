import { injectReloadScript } from '../reload';

describe('injectReloadScript', () => {
    it('the transformation result should match a snapshot', (done) => {
        const sourceFilePath = 'index.html';
        const emptyString = '';
        const htmlString = '<html></html>';
        const htmlWithBodyString = '<html><body></body></html>';

        Promise.all([
            injectReloadScript(sourceFilePath, emptyString),
            injectReloadScript(sourceFilePath, htmlString),
            injectReloadScript(sourceFilePath, htmlWithBodyString),
        ]).then(
            ([
                emptyStringResult,
                htmlStringResult,
                htmlWithBodyStringResult,
            ]) => {
                expect(emptyStringResult).toMatchInlineSnapshot(`
                    "
                        <!-- The script below reloads page on file change. --> 
                        <script>
                            const evtSource = new EventSource('__reload__');
                            evtSource.onmessage = () => {
                                evtSource.close();
                                location.reload();
                            }
                        </script>
                    "
                `);
                expect(htmlStringResult).toMatchInlineSnapshot(`
                    "<html>
                        <!-- The script below reloads page on file change. --> 
                        <script>
                            const evtSource = new EventSource('__reload__');
                            evtSource.onmessage = () => {
                                evtSource.close();
                                location.reload();
                            }
                        </script>
                    </html>"
                `);
                expect(htmlWithBodyStringResult).toMatchInlineSnapshot(`
                    "<html><body>
                        <!-- The script below reloads page on file change. --> 
                        <script>
                            const evtSource = new EventSource('__reload__');
                            evtSource.onmessage = () => {
                                evtSource.close();
                                location.reload();
                            }
                        </script>
                    </body></html>"
                `);
                done();
            }
        );
    });
});
