import { PromotorController } from '@/controllers/promotor.controller';
import { Router } from 'express';

export class promotorRouter {
  private router: Router;
  private promotorController: PromotorController;

  constructor() {
    this.promotorController = new PromotorController();
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.post('/register', this.promotorController.promotorRegister);
    this.router.post('/login', this.promotorController.promotorLogin);
    this.router.get('/', this.promotorController.getPromotor);
  }

  getRouter(): Router {
    return this.router;
  }
}
