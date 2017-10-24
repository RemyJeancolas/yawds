import { Node } from './Node';

export interface Backend {
    getNode(url: string): Promise<Node>;
}
