import { AccountController } from "@/controllers/account.controllers";
import { Router } from "express";
import { VerifyToken } from "@/middlewares/token.middleware";
import { uploader } from "@/helpers/uploder";
export class AccountRouter {
    private router: Router
    private accountController: AccountController
    private verifyAccount: VerifyToken

    constructor() {
        this.accountController = new AccountController()
        this.router = Router()
        this.verifyAccount= new VerifyToken()
        this.initializerRouters()
    }

    private initializerRouters(): void{
        this.router.get('/', this.verifyAccount.verifyToken, this.accountController.getAccount)
        this.router.get('/accountType', this.verifyAccount.verifyToken ,this.accountController.getAccountType)
        this.router.patch('/verify', this.verifyAccount.verifyToken, this.accountController.verify)
        this.router.patch('/images', this.verifyAccount.verifyToken, uploader('IMG', '/images').single('file'), this.accountController.imageUpload)
        this.router.patch('/changeName', this.verifyAccount.verifyToken, this.accountController.changeName) 
        this.router.patch('/changeEmail', this.verifyAccount.verifyToken, this.accountController.changeEmail)
        
    }

    getRouter(): Router{
        return this.router
    }
}