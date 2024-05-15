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
        const { password, ref, email, name, image  } = req.body
        const salt = await genSalt(10)
        const hashPassword = await hash(password,salt)
        let exisUsers = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (ref.length !==0){
            const exisRef = await prisma.user.findUnique({
                where: {
                    referral: ref
                }
            })
            if (exisRef == null) throw "Referral code not exist"
        }
        if(exisUsers?.isActive == true) throw "Email already exist"
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
        
        const payload = { id: users.id, accountType: "users"}
        const token = sign(payload, process.env.KEY_JWT!, { expiresIn: '1h'})
        const link = `http://localhost:3000/register/verivy/${token}`
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
                    isActive: false
                },
            })
            console.log(user);
            
            if (user == null) throw "kjbl Not Found"
            const isValidPass = await compare(password, user.password)
            if(!isValidPass) throw 'Wrong Password'
            const payload = {id: user.id, type: user.type}
            const token = sign(payload, process.env.KEY_JWT!,{expiresIn: '1h'})
            res.status(200).send({
                status: 'ok',
                message: 'user found', 
                token,
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    type: user.type}
            })
        } catch (err) {
            console.log(err);
            res.status(400).send({
                status: 'error',
                message: err
            })
        }
    }
}
