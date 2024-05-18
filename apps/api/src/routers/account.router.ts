import { AccountController } from "@/controllers/account.controllers";
import { Router } from "express";
import { VerifyToken } from "@/middlewares/token.middleware";
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
    }

    getRouter(): Router{
        return this.router
    }
}