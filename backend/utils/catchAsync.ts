import { Request, Response, NextFunction } from 'express';
import { IUser } from '../types';

export interface AuthorizedRequest extends Request {
  user: IUser;
}

export type IsAuthorized<T> = T extends 'auth' ? AuthorizedRequest : Request;

const asyncMiddleware =
  <U extends 'auth' | 'non-auth'>(
    fn: (
      req: IsAuthorized<U>,
      res: Response,
      next: NextFunction,
    ) => Promise<void>,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req as IsAuthorized<U>, res, next).catch(next);
  };

export default asyncMiddleware;
