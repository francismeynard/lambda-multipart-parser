'use strict';

const sinon = require('sinon');
const { assert } = require('chai');

const parser = require('../index.js');

describe('MultipartParser', () => {

    describe('#parser()', () => {

        beforeEach(() => {
            this.callback = sinon.fake();
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should parse the multipart form-data successfully given raw multipart form data', async () => {
            // GIVEN
            const event = {
                headers: {
                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryDP6Z1qHQSzB6Pf8c"
                },
                body: ['------WebKitFormBoundaryDP6Z1qHQSzB6Pf8c',
                    'Content-Disposition: form-data; name="uploadFile1"; filename="test.txt"',
                    'Content-Type: text/plain',
                    '',
                    'Hello World!',
                    '------WebKitFormBoundaryDP6Z1qHQSzB6Pf8c--'
                ].join('\r\n'),
                isBase64Encoded: false
            };

            // WHEN
            const result = await parser.parse(event);

            // THEN
            assert.isNotNull(result.files);
            assert.equal(result.files.length, 1);

            const file = result.files[0];
            assert.equal(file.filename, "test.txt");
            assert.equal(file.contentType, "text/plain");
            assert.equal(file.encoding, "7bit");
            assert.equal(file.fieldname, "uploadFile1");
        });

        it('should parse the multipart form-data successfully given base64 encoded form data', async () => {
            // GIVEN
            const event = {
                headers: {
                    "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryDP6Z1qHQSzB6Pf8c"
                },
                body: `LS0tLS0tV2ViS2l0Rm9ybUJvdW5kYXJ5RFA2WjFxSFFTekI2UGY4Yw0KQ29udGVudC1EaXNwb3NpdGlvbjogZm9ybS1kYXRhOyBuYW1lPSJ1cGxvYWRGaWxlMSI7IGZpb
                        GVuYW1lPSJ0ZXN0LnR4dCINCkNvbnRlbnQtVHlwZTogdGV4dC9wbGFpbg0KDQpIZWxsbyBXb3JsZCENCi0tLS0tLVdlYktpdEZvcm1Cb3VuZGFyeURQNloxcUhRU3pCNl
                        BmOGMNCkNvbnRlbnQtRGlzcG9zaXRpb246IGZvcm0tZGF0YTsgbmFtZT0idXBsb2FkRmlsZTIiOyBmaWxlbmFtZT0iIg0KQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9
                        vY3RldC1zdHJlYW0NCg0KDQotLS0tLS1XZWJLaXRGb3JtQm91bmRhcnlEUDZaMXFIUVN6QjZQZjhjLS0NCg==`,
                isBase64Encoded: true
            };

            // WHEN
            const result = await parser.parse(event);

            // THEN
            assert.isNotNull(result.files);
            assert.equal(result.files.length, 1);

            const file = result.files[0];
            assert.equal(file.filename, "test.txt");
            assert.equal(file.contentType, "text/plain");
            assert.equal(file.encoding, "7bit");
            assert.equal(file.fieldname, "uploadFile1");
        });
        
        it('should parse the multipart form-data successfully given utf8 encoded form data', async () => {
            // GIVEN
            const html = "<p> </p>";
            const event = {
              headers: {
                "Content-Type": "multipart/form-data; boundary=xYzZY",
              },
              body: `--xYzZY\r\nContent-Disposition: form-data; name="html"\r\n\r\n${html}\r\n--xYzZY--\r\n`,
              encoding: 'utf8',
            };

            // WHEN
            const result = await parser.parse(event);

            // THEN
            assert.equal(html, result.html);
        });

        

    });

});