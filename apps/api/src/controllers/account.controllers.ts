import prisma from '@/prisma';
import { Request, Response } from 'express';

export class AccountController {
  async getAccount(req: Request, res: Response) {
    try {
      if (req.user?.type == 'users') {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
        });
        res.status(200).send({
          status: 'ok',
          message: 'users found',
          userData: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            type: user?.type,
            image: user?.image,
            referral: user?.referral,
          },
        });
      }
      if (req.user?.type == 'promotors') {
        const promotor = await prisma.user.findUnique({
          where: {
            id: req.user?.id,
          },
        });
        res.status(200).send({
          status: 'ok',
          message: 'promotors found',
          userData: {
            id: promotor?.id,
            name: promotor?.name,
            email: promotor?.email,
            type: promotor?.type,
            image: promotor?.image,
          },
        });
      }
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }
  async getAccountType(req: Request, res: Response) {
    try {
      const type = req.user?.type;
      res.status(200).send({
        status: 'ok',
        message: 'type found',
        type,
      });
    } catch (error) {
        res.status(400).send({
            status: 'error',
            error
        })
    }
  }
  async verify(req: Request, res: Response) {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const expired = date.setMonth(date.getMonth() + 3);
    try {
      if (req.user?.type == 'users') {
        const user = await prisma.user.update({
          data: {
            isActive: true,
            redeem: false,
          },
          where: {
            id: req.user.id,
          },
        });
        await prisma.point.create({
          data: {
            userId: req.user.id,
            expiredDate: new Date(expired),
          },
        });
        const point = await prisma.point.aggregate({
          where: {
            userId: req.user.id,
            redeem: false,
          },
          _sum: {
            point: true,
          },
          _min: {
            expiredDate: true,
          },
        });
      } else {
        req.user?.type == 'promotors';
      }
      {
        const promotor = await prisma.user.update({
          data: {
            isActive: true,
          },
          where: {
            id: req.user?.id,
          },
        });
      }
      res;
    } catch (error) {
      res.status(200).send({
        status: 'error',
        error,
      });
    }
  }
}
