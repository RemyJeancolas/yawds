import 'reflect-metadata';
import { Container } from 'inversify';

import { WebdavService } from './services/WebdavService';
import { WebdavController } from './controllers/WebdavController';

const container = new Container();

container.bind<WebdavService>('Service').to(WebdavService).inSingletonScope().whenTargetNamed('Webdav');
container.bind<WebdavController>('Controller').to(WebdavController).inSingletonScope().whenTargetNamed('Webdav');

export { container };
