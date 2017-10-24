import * as path from 'path';
import { Server } from './Server';
import { Backend } from './dav/backends/fs/Backend';

function uncaughtException(err: Error): void {
    console.error(err);
    process.exit(1);
}

process.on('uncaughtException', uncaughtException);

const server = new Server({
    port: 8080,
    baseUri: 'dav',
    backend: new Backend(path.resolve(__dirname, '..', 'var'))
});

server.start().catch(uncaughtException);
