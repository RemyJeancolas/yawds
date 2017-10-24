import { injectable, inject, named } from 'inversify';
import { WebdavModel } from '../models/WebdavModel';
import { MultiStatus } from '../entities/MultiStatus';

@injectable()
export class WebdavService {
    constructor(@inject('Model') @named('Webdav') private webdavModel: WebdavModel) {}

    public async propfind(depth: string, data: string): Promise<MultiStatus> {
        const propfind = await this.webdavModel.parseProfind(depth, data);
        console.log(propfind);
        return new MultiStatus();
    }
}
