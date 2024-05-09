import { UserController } from '@/controllers/user.controller'
import { Validator } from '@/middlewares/validator'

import { Router } from 'express'

export class UserRouter {
    private router: Router
    private userController: UserController
    private validator: Validator


    constructor() {
        this.userController = new UserController()
        this.validator = new Validator()
        this.router = Router()
        this.initializeRoutes()
    }

    private initializeRoutes(): void {
        // this.router.get('/verify', this.userMiddleware.verifyToken, this.userController.verifyUsers)
        this.router.get('/', this.userController.getUser)
        this.router.post('/register', this.validator.validateRegister , this.userController.userRegister)
        this.router.post('/login', this.validator.validateLogin , this.userController.loginUser)
    }

    getRouter() {
        return this.router
    }
}