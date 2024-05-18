import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { genSalt, hash, compare} from 'bcrypt'
import { sign } from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import Handlebars from 'handlebars'
import { transporter } from '@/helpers/nodemailer'

const prisma = new PrismaClient()
export class UserController {
    async getUser(req: Request, res: Response) {
        try {
            const users = await prisma.user.findMany()
            res.status(200).send({
                status: 'ok',
                users
            })
        } catch (err) {
            res.status(400).send({
                status: 'err',
                message: err
            })
        }
    }
    async userRegister( req: Request, res: Response) { 
        try {
        const { password, referral, email, name, image  } = req.body
        const salt = await genSalt(10)
        const hashPassword = await hash(password,salt)
        let userId
        let exisUsers = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (exisUsers?.isActive == true) throw 'email already exist'
        if (referral.length !==0){
            const exisRef = await prisma.user.findUnique({
                where: {
                    referral: referral,
                    isActive: true
                }
            })
            if (exisRef == null) throw "Referral code not exist"
            userId = exisRef.id
        }
        if(exisUsers?.isActive == false && exisUsers){
            exisUsers = await prisma.user.update({
                data: {
                    name,
                    email,
                    image,
                    password: hashPassword
                },
                where:{
                    email
                }
            })
        }
        else{
            exisUsers = await prisma.user.create({
                data: {
                    name,
                    email,
                    image,
                    password: hashPassword,
                    referral: ''
                }
            })
        }
        const refUser = exisUsers.name + exisUsers.id
        const refFix = refUser.toString()
        const users = await prisma.user.update({
            data: {
                referral: refFix
            }, where:{
                email: exisUsers.email
            }
        })
        console.log(userId);
        
        const payload = { id: users.id, type: users.type, userId: userId}
        const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h'})
        const link = `http://localhost:3000/verify/${token}`
        const templatePath = path.join(__dirname, "../templates", "register.html")
        const templateSource = fs.readFileSync(templatePath, "utf-8")
        const compiledTemplates = Handlebars.compile(templateSource)
        const html = compiledTemplates({
            name: users.name,
            link
        })
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: users.email,
            subject: "Verify your account",
            html
        })
        res.status(200).send({
            status: 'ok',
            message: 'User Created',
            users,
            type: users.type,
            token
        })
        } catch (err) {
            res.status(400).send({
                status: 'error',
                message: err
            })
        }
    } 
    async loginUser(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await prisma.user.findFirst({
                where: {
                    email,
                    isActive: true
                },
            })
            if (user == null) throw "Users Not Found"
            const isValidPass = await compare(password, user.password)
            if(!isValidPass) throw 'Wrong Password'
            const payload = {id: user.id, type: user.type}
            const token = sign(payload, process.env.KEY_JWT!,{expiresIn: '1h'})
            const getPoint = await prisma.point.findFirst({
                where: {
                    userId: user.id,
                    redeem: false
                }
            })
            if (getPoint !== null){
                const point = await prisma.point.aggregate({
                    where: {
                        userId: user.id,
                        redeem: false
                    },
                    _sum: {
                        point: true
                    },
                    _min: {
                        expiredDate: true
                    }
                })
                const expireSoonPoint = await prisma.point.aggregate({
                    where: {
                        expiredDate: new Date(point._min?.expiredDate!),
                        redeem: false
                    },
                    _sum: {
                        point: true
                    }
                })
                return res.status(200).send({
                    status: 'ok',
                    mesage: 'user found',
                    token,
                    data: {
                        is: user.id,
                        name: user.name,
                        email: user.email,
                        referral: user.referral,
                        type: user.type,
                        sumPoint: point._sum.point,
                        expireSoonPoint: expireSoonPoint._sum.point,
                        expireDate: point._min.expiredDate,
                        image: user.image
                    }
                })
            } else {
                return res.status(200).send({
                    status: 'ok',
                    message: 'user found & has no point',
                    data: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        referral: user.referral,
                        sumPoint: 0,
                        type: user.type,
                        image: user.image
                    },
                    token
                })
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({
                status: 'error',
                message: err
            })
        }
    }
}
