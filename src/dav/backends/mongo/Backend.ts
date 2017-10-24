import { Backend as BackendBase } from '../Backend';
import { Node } from '../Node';

export class Backend implements BackendBase {
    public async getNode(url: string): Promise<Node> {
        return null;
    }
}
