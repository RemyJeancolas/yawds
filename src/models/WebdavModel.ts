import { injectable } from 'inversify';
import { BadRequest, UnprocessableEntity } from 'http-errors';
import { ModelBase } from './ModelBase';
import { Constants } from '../dav/Constants';
import { Depth } from '../entities/Depth';
import { Propfind } from '../entities/Propfind';

@injectable()
export class WebdavModel extends ModelBase {
    protected parseDepth(input: string): Depth {
        if (!input) {
            return Depth.Infinity;
        }
        const depth: any = Depth[<any> input];
        if (!depth) {
            throw new BadRequest('Invalid Depth header');
        }
        return <any> Depth[depth];
    }

    public async parseProfind(depth: string, data: string): Promise<Propfind> {
        let props: string[];
        let namesOnly: boolean = false;
        let allProps: boolean = false;

        const defaultProps: string[] = []; // TODO: set default props in array

        if (data) {
            const xml = await this.parseXml(data);
            if (xml && typeof xml === 'object' && xml.hasOwnProperty(Constants.propfindElem)) {
                // Filter content to check propfind validity
                const keys = Object.keys(xml[Constants.propfindElem]).filter(
                    k => [Constants.propElem, Constants.propnameElem, Constants.allpropElem].indexOf(k) >= 0
                );

                if (keys.length === 0) {
                    throw new UnprocessableEntity('Either allprop, propname or prop should be defined inside propfind element');
                } else if (keys.length > 1) {
                    throw new UnprocessableEntity('Invalid propfind instructions');
                }

                switch (keys[0]) {
                    case Constants.propElem: // prop
                        props = Object.keys(xml[Constants.propfindElem][Constants.propElem]).filter((e, p, s) => s.indexOf(e) === p);
                        break;
                    case Constants.propnameElem: // propname
                        namesOnly = true;
                        allProps = true;
                        props = defaultProps;
                        break;
                    default: // allprops
                        allProps = true;
                        props = defaultProps;
                        const include = xml[Constants.propfindElem][Constants.includeElem];
                        if (include && typeof include === 'object') {
                            props = props.concat(Object.keys(include)).filter((e, p, s) => s.indexOf(e) === p);
                        }
                        break;
                }
            }
        }

        return new Propfind(this.parseDepth(depth), props, namesOnly, allProps);
    }
}
