import { Node } from './Node';

export class Collection extends Node {
    public get isCollection(): boolean {
        return true;
    }
}
