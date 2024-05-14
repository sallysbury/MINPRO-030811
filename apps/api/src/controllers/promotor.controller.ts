import { Request, Response} from 'express'
import { sign } from 'jsonwebtoken'
import { compare, genSalt, hash } from 'bcrypt'
import Handlebars from 'handlebars'
import path from 'path'
import fs from 'fs'
import { PrismaClient } from '@prisma/client'
import { transporter } from '@/helpers/nodemailer'

const prisma = new PrismaClient()
export class PromotorController {
    async getPromotor(req: Request, res: Response){
        try {
            const promotor = await prisma.promotor.findMany()
            res.status(200).send({
                status: 'ok',
                promotor
            })
        } catch (err) {
            res.status(400).send({
                status: 'error',
                message: err
            })
        }
    }
    async promotorRegister(req: Request, res: Response){
        try {
        const { name, email, password, image  } = req.body
        const salt = await genSalt(10)
        const hashPassword = await hash(password,salt)
        let promotor = await prisma.promotor.findUnique({
            where: {
                email
            }
        })
        if (promotor?.isActive == true) throw "Email Already Exist"
        if (promotor?.isActive == false && promotor){
            promotor = await prisma.promotor.update({
                data: {
                    name,
                    email,
                    password: hashPassword,
                    image
                },
                where: {
                    email
                }
            })
        }
        else {
            promotor = await prisma.promotor.create({
                data: {
                    name, 
                    email,
                    password: hashPassword,
                    image
                }
            })
        }
        const payload = {id: promotor.id, accountType: "promotor"}
        const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1h'})
        const link = `http://localhost:3000/register/verify/${token}`
        const templatePath = path.join(__dirname, "../templates", "register.html")
        const templateSource = fs.readFileSync(templatePath, "utf-8")
        const compiledTemplates = Handlebars.compile(templateSource)
        const html = compiledTemplates({
            name: promotor.name,
            link
        })
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: promotor.email,
            subject: "Verify your account",
            html
        })
        res.status(200).send({
            status: 'ok',
            message: 'Created',
            promotor,
            token
        })
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error
            })
        }
        
    }
    async promotorLogin (req: Request, res: Response){
        try {
            const {email, password} = req.body
            const promotor = await prisma.promotor.findFirst({
                where: {
                    email,
                }
            })
            if (promotor == null ) throw "User Not Found!"
            const isValidPass = await compare(password, promotor.password)
            if (isValidPass == false) throw "Wrong Password"
            const payload = {id: promotor.id, type: promotor.type}
            const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '1h'}) 
            res.status(200).send({
                status: 'ok', 
                token, 
                data: {
                    id: promotor.id,
                    name: promotor.name,
                    email: promotor.email,
                    type: promotor.type
                }
            })
        } catch (error) {
            res.status(400).send({
                status: 'error',
                message: error
            })
        }
    }
}