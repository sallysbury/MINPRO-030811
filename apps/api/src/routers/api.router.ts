import { Router } from 'express'
import { UserRouter } from './user.router'
import { promotorRouter } from './promotor.router'

export class ApiRouter {
    private userRouter: UserRouter
    private promotorRouter: promotorRouter
    private router: Router

    constructor() {
        this.router = Router()
        this.userRouter = new UserRouter()
        this.promotorRouter = new promotorRouter()
        this.initializeRoutes()
    }
    private initializeRoutes(): void {
        this.router.use('/users', this.userRouter.getRouter())
        this.router.use('/promotors', this.promotorRouter.getRouter())

    }

    getRouter(): Router {
        return this.router
    }
}