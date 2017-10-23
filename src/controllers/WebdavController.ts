import { injectable, inject, named } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { ControllerBase } from './ControllerBase';
import { Propfind } from '../dav/elements/Propfind';
import { WebdavService } from '../services/WebdavService';

@injectable()
export class WebdavController extends ControllerBase {
    constructor(@inject('Service') @named('Webdav') private webdavService: WebdavService) {
        super();
    }

    public async options(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.header('DAV', '1').end();
        } catch (e) {
            this.handleError(e, next);
        }
    }

    public async propfind(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log(await Propfind.parse(req.body));
            throw new Error('foo');
        } catch (e) {
            this.handleError(e, next);
        }
    }
}
