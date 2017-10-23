import * as xml2js from 'xml2js';

export class XmlParseError extends Error {}

export abstract class Base {
    private static xmlParserOptions: any = {
        explicitArray: false,
        ignoreAttrs: true,
        xmlns: true,
        async: true
    };

    protected static parseXml(data: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            xml2js.parseString(data, this.xmlParserOptions, (err, result) => {
                if (err) {
                    return reject(new XmlParseError('Invalid xml element'));
                }

                return resolve(result);
            });
        });
    }
}
