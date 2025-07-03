import { Request, Response, NextFunction } from 'express';
import { NotFoundException } from '../common/exceptions';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundException('The requested resource could not be found');
};

export default notFoundHandler;
