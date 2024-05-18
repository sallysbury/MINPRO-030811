import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";

export class updatePoint {
    updatePointUser = async (req: Request, res:Response, next: NextFunction) => {
        const pointUsers = await prisma.point.findMany({
            where: {
                expiredDate: {
                    not: ""
                }
            }
        })
        for (const pointUser of pointUsers) {
            if (pointUser.expiredDate && new Date() > pointUser.expiredDate){
                await prisma.point.update({
                    where:{
                        id: pointUser.id
                    },
                    data: {
                        redeem: true
                    }
                })
            }
        }
        next()
    }
}