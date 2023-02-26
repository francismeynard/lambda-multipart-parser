'use strict';

const Busboy = require('busboy');
const Crypto = require('crypto');

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
                fieldname: 'uploadFile1',
                size: 26000,
                checksum: "387d3143b0baa6beb292eda4f81b2d33e55c6744"
            }
        ],
        field1: 'VALUE1',
        field2: 'VALUE2',
    }
 */
const parse = (event) => new Promise((resolve, reject) => {
    const busboy = new Busboy({
        headers: {
            'content-type': event.headers['content-type'] || event.headers['Content-Type']
        }
    });
    const result = {
        files: []
    };

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const uploadFile = {};

        file.on('data', data => {
            uploadFile.content = data;
        });

        file.on('end', () => {
            if (uploadFile.content) {
                uploadFile.filename = filename;
                uploadFile.contentType = mimetype;
                uploadFile.encoding = encoding;
                uploadFile.fieldname = fieldname;
                uploadFile.size = Buffer.byteLength(uploadFile.content);
                uploadFile.checksum = Crypto.createHash('sha1').update(uploadFile.content, "utf-8").digest('hex');
                result.files.push(uploadFile);
            }
        });
    });

    busboy.on('field', (fieldname, value) => {
        result[fieldname] = value;
    });

    busboy.on('error', error => {
        reject(error);
    });

    busboy.on('finish', () => {
        resolve(result);
    });

    const encoding = event.encoding || (event.isBase64Encoded ? "base64" : "binary");

    busboy.write(event.body, encoding);
    busboy.end();
});

module.exports.parse = parse;