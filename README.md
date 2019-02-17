# lambda-multipart-parser
```
npm install lambda-multipart-parser --save
```

## Introduction
This nodejs module will parse the multipart-form containing files and fields from the AWS lambda event object. It works very well parsing **binary** and text files.

## Description
```
@param {event} - an event containing the multipart-form in the body
@return {object} - a JSON object containing array of files and fields, sample below.

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
```

## Usage
```
const parser = require('lambda-multipart-parser');

const result = await parser.parse(event);
console.log(result.files);
```

Sample Lambda implemetation with Cloudformation can be found in http://francismeynard.github.io/aws-upload-document-service.

## Test
```
npm run test
```