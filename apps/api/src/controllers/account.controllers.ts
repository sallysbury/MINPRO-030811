import prisma from '@/prisma';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';

export class AccountController {
  async getAccount(req: Request, res: Response) {
    try {
        console.log(req.user?.type);
        
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
        const promotor = await prisma.promotor.findUnique({
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
        const expireSoonPoint = await prisma.point.aggregate({
            where: {
                expiredDate: new Date(point._min.expiredDate!),
                redeem: false
            },
            _sum: {
                point: true
            }
        })

        const payload = { id: user.id, type: user.type}
        const token = sign(payload, process.env.KEY_JWT!,{expiresIn: "id"})
        return res.status(200).send({
            status: 'ok',
            message: 'user found',
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                referral: user.referral,
                type: user.type,
                sum : point._sum.point,
                expireSoonPoint: expireSoonPoint._sum.point,
                expireDate: point._min.expiredDate,
                image: user.image
            }
        })
        } else {
           const user = await prisma.user.update({
                data: {
                    isActive: true
                },
                where: {
                    id: req.user?.id
                }
            })
            const payload = {id: user.id, type: user.type}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1d'})
            res.status(200).send({
                status: "ok",
                message: 'user has no point',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    referral: user.referral,
                    sum: 0,
                    type: user.type
                },
                token
            })
        }
        if (req.user?.type == "promotors"){
            const promotor = await prisma.user.update({
                data: {
                    isActive: true
                },
                where: {
                    id: req.user.id
                }
            })
            const payload = {id: promotor.id, type: promotor.type}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1d'})
            res.status(200).send({
                status: 'ok',
                meesage: 'promotor verified',
                token,
                data: {
                    id: promotor.id,
                    name: promotor.name,
                    email: promotor.email,
                    type: promotor.type,
                    image: promotor.image
                }
            })
        }
    } 
    catch (error) {
      res.status(200).send({
        status: 'error',
        error,
      });
    }
  }
}
