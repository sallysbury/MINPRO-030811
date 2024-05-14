import { Router } from 'express'
import { UserRouter } from './user.router'
import { promotorRouter } from './promotor.router'
import { AccountRouter } from './account.router'

export class ApiRouter {
    private userRouter: UserRouter
    private promotorRouter: promotorRouter
    private accountRouter: AccountRouter
    private router: Router

    constructor() {
        this.router = Router()
        this.userRouter = new UserRouter()
        this.promotorRouter = new promotorRouter()
        this.accountRouter = new AccountRouter()
        this.initializeRoutes()
    }
    private initializeRoutes(): void {
        this.router.use('/users', this.userRouter.getRouter())
        this.router.use('/promotors', this.promotorRouter.getRouter())
        this.router.use('/accounts',this.accountRouter.getRouter())

    }

    getRouter(): Router {
        return this.router
    }
}