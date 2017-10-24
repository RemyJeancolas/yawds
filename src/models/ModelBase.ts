import * as xml2js from 'xml2js';
import { injectable } from 'inversify';
import { BadRequest } from 'http-errors';

@injectable()
export abstract class ModelBase {
    private xmlParserOptions: xml2js.Options = {
        explicitArray: false,
        ignoreAttrs: true,
        xmlns: true,
        async: true
    };

    protected parseXml(input: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            xml2js.parseString(input, this.xmlParserOptions, (err, data) => {
                if (err) {
                    return reject(new BadRequest('Invalid xml element'));
                }

                return resolve(this.cleanXml(data));
            });
        });
    }

    private cleanXml(input: any): any {
        if (input && typeof input === 'object') {
            let result: any = {};
            Object.keys(input).filter(k => k !== '$ns').forEach(key => {
                if (input[key].hasOwnProperty('$ns')) {
                    const fullKey = `{${input[key].$ns.uri}}${input[key].$ns.local}`;
                    result[fullKey] = input[key].hasOwnProperty('_') ? input[key]._ : this.cleanXml(input[key]);
                } else if (Array.isArray(input[key])) {
                    result = [];
                    input[key].forEach((item: any) => {
                        result.push(this.cleanXml({key: item}));
                    });
                }
            });

            return result;
        } else {
            return input;
        }
    }
}
