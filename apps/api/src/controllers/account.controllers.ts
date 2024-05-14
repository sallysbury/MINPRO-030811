import prisma from "@/prisma";
import { Request, Response } from "express";

export class AccountController {
    async getAccountType(req: Request, res: Response) {
   try {
    const accountType = req.user?.type
    res.status(200).send({
        status: 'ok',
        message: 'accountType found',
        accountType
    })
   } catch (error) {
    res.status(400).send({
        status:'error',
        message: error
    })
   }
}
    async getAccount(req: Request, res: Response){
        try {
            if (req.user?.type == "Users"){
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
        } catch (error) {
            
        }
    }
}