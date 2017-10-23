import { Server } from './Server';

function uncaughtException(err: Error): void {
    console.error(err);
    process.exit(1);
}

process.on('uncaughtException', uncaughtException);

const server = new Server({port: 8080, baseUri: 'dav'});

server.start().catch(uncaughtException);
