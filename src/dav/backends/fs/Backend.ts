import * as fs from 'fs';
import * as path from 'path';
import { Backend as BackendBase } from '../Backend';
import { Node } from './Node';
import { Collection } from './Collection';
import { File } from './File';

export class Backend implements BackendBase {
    private rootPath: string;

    public constructor(rootPath: string) {
        try {
            const stats = fs.statSync(rootPath);
            if (!stats.isDirectory()) {
                throw new Error(`Path ${rootPath} is not a directory`);
            }

            try {
                fs.accessSync(rootPath, fs.constants.W_OK);
                this.rootPath = `${rootPath.replace(new RegExp(`${path.sep}+$`), '')}${path.sep}`;
            } catch (e) {
                throw new Error(`Path ${rootPath} is not writable`);
            }
        } catch (e) {
            if (e.code === 'ENOENT') {
                try {
                    fs.mkdirSync(rootPath);
                    return;
                } catch (err) {
                    throw new Error(`Path ${rootPath} doesn't exist and cannot be created`);
                }
            }
            throw e;
        }
    }

    public async getNode(url: string): Promise<Node> {
        const realPath = this.getRealPath(url);
        if (!this.isInRootPath(realPath)) {
            return null;
        }

        const stats = await this.getStat(realPath);
        if (stats) {
            const fullPath = path.resolve(realPath);
            if (stats.isDirectory()) {
                return new Collection(this.rootPath, fullPath, stats);
            } else if (stats.isFile()) {
                return new File(this.rootPath, fullPath, stats);
            }
        }

        return null;
    }

    private getRealPath(url: string): string {
        return path.join(this.rootPath, url.replace(/^\/+/, '').replace('/', path.sep));
    }

    private isInRootPath(url: string): boolean {
        return url.startsWith(this.rootPath);
    }

    private getStat(url: string): Promise<fs.Stats> {
        return new Promise<fs.Stats>((resolve, reject) => {
            fs.stat(url, (err, stats) => {
                if (err) {
                    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
                        return resolve(null);
                    }
                    return reject(err);
                }

                return resolve(stats);
            });
        });
    }
}
