import * as xmlbuilder from 'xmlbuilder';
import { STATUS_CODES } from 'http';
import { Constants } from './Constants';

export class Error {
    private elem: any;

    public constructor(message: string, code: number = 500) {
        this.elem = xmlbuilder.create('D:error', {allowSurrogateChars: true})
            .attribute('xmlns:D', Constants.davNamespace)
            .attribute('xmlns:Y', Constants.appNamespace);

        this.elem.ele('Y:status', null, `HTTP/1.1 ${code} ${this.getErrorMessage(code)}`);
        this.elem.ele('Y:message', null, message);
    }

    public toString(pretty: boolean = false): string {
        return this.elem.end({pretty});
    }

    private getErrorMessage(code: number): string {
        return STATUS_CODES.hasOwnProperty(code) ? STATUS_CODES[code] : 'Unknown';
    }
}
