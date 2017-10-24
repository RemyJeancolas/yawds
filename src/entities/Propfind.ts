import { Depth } from './Depth';

export class Propfind {
    public readonly depth: Depth;
    public readonly props: string[];
    public readonly namesOnly: boolean;
    public readonly allProps: boolean;

    constructor(depth: Depth, props: string[], namesOnly: boolean, allProps: boolean) {
        this.depth = depth;
        this.props = props;
        this.namesOnly = namesOnly;
        this.allProps = allProps;
    }
}
