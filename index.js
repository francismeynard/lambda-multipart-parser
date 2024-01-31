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
    console.log("BUSBOyy---!!!! TESTIN TESTING123", JSON.stringify(event));

    const bb = Busboy({
        headers: {
            'Content-Type': event.headers['content-type'] || event.headers['Content-Type']
        },
        'Content-Type': event.headers['content-type'] || event.headers['Content-Type']
    });
    const result = {
        files: []
    };

    bb.on('file', (fieldname, file, info) => {
        const uploadFile = {};
        const { filename, encoding, mimeType } = info;
        
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
    });

    bb.on('field', (fieldname, value) => {
        result[fieldname] = value;
    });

    bb.on('error', error => {
        reject(error);
    });

    bb.on('close', () => {
        resolve(result);
    });

    const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");

    bb.write(event.body, encoding);
    bb.end();
});

module.exports.parse = parse;