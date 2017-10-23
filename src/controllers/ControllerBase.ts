import { injectable } from 'inversify';
import { NextFunction } from 'express';
import { BadRequest } from 'http-errors';
import { XmlParseError } from '../dav/elements/Base';

@injectable()
export abstract class ControllerBase {
    protected handleError(err: Error, next: NextFunction): void {
        if (err instanceof XmlParseError) {
            return next(new BadRequest(err.message));
        }

        next(err);
    }
}
