import { injectable, inject, named } from 'inversify';
import { Backend } from '../dav/backends/Backend';
import { WebdavModel } from '../models/WebdavModel';
import { MultiStatus } from '../entities/MultiStatus';

@injectable()
export class WebdavService {
    constructor(
        @inject('Backend') @named('Webdav') private backend: Backend,
        @inject('Model') @named('Webdav') private webdavModel: WebdavModel
    ) {}

    private getInternalUrl(baseUri: string, url: string): string {
        return `/${url.replace(baseUri, '')}`;
    }

    private getExternalUrl(baseUri: string, url: string): string {
        return `${baseUri}${url.replace(/^\/+/, '')}`;
    }

    public async propfind(baseUri: string, url: string, depth: string, data: string): Promise<MultiStatus> {
        const internalUrl = this.getInternalUrl(baseUri, url);

        const node = await this.backend.getNode(internalUrl);
        if (!node) {
            return null;
        }

        // console.log(baseUri, url, internalUrl, this.getExternalUrl(baseUri, internalUrl));
        console.log(node);
        const propfind = await this.webdavModel.parseProfind(depth, data);
        console.log(propfind);
        return new MultiStatus();
    }
}
