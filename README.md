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

**Important**
Please make sure to enable the "Use Lambda Proxy integration" in API Gateway method Integration request. 

If decided not to enable it for some reason, make sure to pass the required Lambda event parameters in Integration Request -> Mapping Templates section, such as body, headers and isBase64Encoded flag.

Sample Lambda and API Gateway implementation with Cloudformation can be found in [here](http://francismeynard.github.io/aws-upload-document-service).

## Test
```
npm run test
```

## Releases / Changelogs

0.0.1 - Initial stable release.

0.0.2 - Updated readme. Added Usage and link to sample implementation.

1.0.0 - Formalized package release version. Add utf8 support.

1.0.1 - Added support for TypeScript typings.
