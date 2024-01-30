'use strict';

const Busboy = require('busboy');

/*
 * This module will parse the multipart-form containing files and fields from the lambda event object.
 * @param {event} - an event containing the multipart-form in the body
 * @return {object} - a JSON object containing array of files and fields, sample below.
    {
        files: [
            {
                filename: 'test.pdf',
                content: <Buffer 25 50 6f 62 ... >,
                contentType: 'application/pdf',
                encoding: '7bit',
                fieldname: 'uploadFile1'
            }
        ],
        field1: 'VALUE1',
        field2: 'VALUE2',
    }
 */
const parse = (event) => new Promise((resolve, reject) => {
    console.log("BUSBOX", JSON.stringify(event.headers));

    let ContentType = event.headers['content-type'] || event.headers['Content-Type'];
    ContentType = ContentType.split(";")[0];

    const busboy = Busboy({
        headers: {
            'content-type': ContentType
        }
    });
    const result = {
        files: []
    };

    busboy.on('file', (fieldname, file, info) => {
        const { filename, encoding, mimeType } = info;
        const uploadFile = {};

        file.on('data', data => {
            uploadFile.content = data;
        });

        file.on('end', () => {
            if (uploadFile.content) {
                uploadFile.filename = filename;
                uploadFile.contentType = mimeType;
                uploadFile.encoding = encoding;
                uploadFile.fieldname = fieldname;
                uploadFile.size = Buffer.byteLength(uploadFile.content);
                result.files.push(uploadFile);
            }
        });
    }); //.end(event.request.rawBody);

    busboy.on('field', (fieldname, value) => {
        result[fieldname] = value;
    });

    busboy.on('error', error => {
        reject(error);
    });

    busboy.on('close', () => {
        resolve(result);
    });

    const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");

    busboy.write(event.body, encoding);
    busboy.end();
});

module.exports.parse = parse;