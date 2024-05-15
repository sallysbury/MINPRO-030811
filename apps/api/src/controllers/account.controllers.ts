import prisma from "@/prisma";
import { Request, Response } from "express";

export class AccountController {
    async getAccount(req: Request, res: Response){
    try {
        console.log(req.user?.type);
        
        if (req.user?.type == "users"){
            const user = await prisma.user.findUnique({
                where: {
                    id: req.user.id
                }
            })
            res.status(200).send({
                status: "ok",
                message: 'users found',
                userData: {
                    id: user?.id,
                    name: user?.name,
                    email: user?.email,
                    type: user?.type,
                    image: user?.image,
                    referral: user?.referral
                }
            })
        }
        if (req.user?.type == "promotors"){
        const promotor = await prisma.user.findUnique({
            where: {
                id: req.user?.id
            }
        })
        res.status(200).send({
            status: "ok",
            message: 'promotors found',
            userData: {
                id: promotor?.id,
                name: promotor?.name,
                email: promotor?.email,
                type: promotor?.type,
                image: promotor?.image
            }
        })
    }} catch (error) {
        res.status(400).send({
            status: 'error',
            error
        })
    }
    }
    async getAccountType(req: Request, res: Response){
        try {
            const type = req.user?.type
            res.status(200).send({
                status: 'ok',
                message: 'type found',
                type
            })
        } catch (error) {
            
        }
    }
}