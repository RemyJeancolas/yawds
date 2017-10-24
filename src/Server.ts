import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as onHeaders from 'on-headers';
import * as onFinished from 'on-finished';
import * as moment from 'moment';
import { MethodNotAllowed, NotFound } from 'http-errors';
import { container } from './Container';
import { Error as DavError } from './dav/Error';
import { Constants } from './dav/Constants';
import { WebdavController } from './controllers/WebdavController';
import { displayIP } from 'range_check';
import { Backend } from './dav/backends/Backend';

interface ServerConfig {
    port: number;
    backend: Backend;
    baseUri?: string;
    maxBodyLength?: string|number;
}

export class Server {
    private port: number;
    private baseUri: string;
    private maxBodyLength: string|number;

    private server: express.Application;
    private webdavController: WebdavController;
    private backend: Backend;

    constructor(config: ServerConfig) {
        if (typeof config !== 'object' || typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
            throw new TypeError('config.port must be a number between 1 and 65535');
        }

        this.port = config.port;
        this.baseUri = typeof config.baseUri === 'string'
            ? `/${config.baseUri.trim().replace(/^\/+|\/+$/g, '')}/`
            : '/';

        this.maxBodyLength = config.maxBodyLength || '1mb';

        // Save backend and bind it to inject it everywhere if needed
        this.backend = config.backend;
        container.bind<Backend>('Backend').toConstantValue(this.backend).whenTargetNamed('Webdav');

        this.webdavController = container.getNamed<WebdavController>('Controller', 'Webdav');
    }

    public start(): Promise<Server> {
        if (this.server) {
            return Promise.reject(new Error('Server is already started'));
        }

        return new Promise<Server>((resolve, reject) => {
            // Create server
            this.server = express();

            // Remove X-Powered-By header
            this.server.disable('x-powered-by');

            // Add request logger
            this.server.use(this.logRequest.bind(this));

            // Add body parser with limits
            this.server.use(bodyParser.text({
                type: '*/xml',
                limit: this.maxBodyLength
            }));

            // Add handler for all routes
            this.server.all('*', this.handleRequest.bind(this));

            // Add error handler, MUST be the last middleware
            this.server.use(this.handleError.bind(this));

            // Start listening for connections
            this.server.listen(this.port, (err: Error) => {
                if (err) {
                    this.server = null;
                    return reject(err);
                }
                return resolve(this);
            });
        });
    }

    private logRequest(req: express.Request, res: express.Response, next: express.NextFunction): void {
        const start = Date.now();
        let duration = 0;

        onHeaders(res, () => {
            duration = Date.now() - start;
        });

        onFinished(res, () => {
            const ip = displayIP(req.connection.remoteAddress);
            const user = '-';
            const time = moment().format();
            const method = req.method;
            const url = encodeURI(req.url);
            const httpVersion = `HTTP/${req.httpVersion}`;
            const code = res.statusCode;
            const size = res.get('content-length') ? res.get('content-length') : '-';
            const referer = req.header('referer') || '-';
            const ua = req.header('user-agent') || '-';

            process.stdout.write(
                `${ip} ${user} ${time} "${method} ${url} ${httpVersion}" ${code} ${size} "${referer}" "${ua}" - ${duration}ms\n`
            );
        });

        next();
    }

    private async handleError(err: Error, req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        const statusCode: number = (<any> err).statusCode || 500;
        if (statusCode > 499) {
            console.error(err);
        }

        res.header('Content-Type', Constants.contentType).status(statusCode).send(new DavError(err.message, statusCode).toString());
        next();
    }

    private async handleRequest(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
        // Check if request url has to be handled by the server
        if (!req.url.startsWith(this.baseUri)) {
            if (`${req.url}/` === this.baseUri) {
                return res.redirect(this.baseUri);
            }
            return next(new NotFound('Resource not found'));
        }

        // Save baseUri in request in order to be able to perform url translation later
        req.baseUri = this.baseUri;

        try {
            switch (req.method) {
                case 'OPTIONS': return await this.webdavController.options(req, res, next);
                case 'PROPFIND': return await this.webdavController.propfind(req, res, next);
                default: next(new MethodNotAllowed('Method not allowed'));
            }
        } catch (e) {
            next(e);
        }
    }
}
