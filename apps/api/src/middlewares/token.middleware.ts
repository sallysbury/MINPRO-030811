import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

export class VerifyToken {
  verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      let token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw 'Unauthorized';
      const verifyUser = verify(token, process.env.KEY_JWT!);
      req.user = verifyUser as User;
      next();
    } catch (err) {
      res.status(400).send({
        status: 'err',
        message: err,
      });
    }
  }
}
