import { Node } from './Node';

export class File extends Node {
    public get isFile(): boolean {
        return true;
    }
}
