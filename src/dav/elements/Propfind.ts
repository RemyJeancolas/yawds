import { Base } from './Base';

export class Propfind extends Base {
    public static async parse(data: string): Promise<Propfind> {
        return this.parseXml(data);
    }
}
