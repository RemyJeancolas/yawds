import { injectable, inject, named } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { NotFound } from 'http-errors';
import { WebdavService } from '../services/WebdavService';

@injectable()
export class WebdavController {
    constructor(@inject('Service') @named('Webdav') private webdavService: WebdavService) {}

    public async options(req: Request, res: Response, next: NextFunction): Promise<void> {
        res.header('DAV', '1').end();
    }

    public async propfind(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = await this.webdavService.propfind(req.baseUri, req.url, req.get('depth'), req.body);
        if (!result) {
            throw new NotFound(`Resource ${req.url} not found`);
        }
        console.log(result);
        throw new Error('foo');
    }
}
