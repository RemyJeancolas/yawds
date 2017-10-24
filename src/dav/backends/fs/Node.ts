import * as fs from 'fs';
import { Node as NodeBase } from '../Node';

export abstract class Node extends NodeBase {
    protected rootPath: string;
    protected fullPath: string;
    protected stats: fs.Stats;

    public constructor(rootPath: string, fullPath: string, stats: fs.Stats) {
        super();
        this.rootPath = rootPath;
        this.fullPath = fullPath;
        this.stats = stats;
    }
}
