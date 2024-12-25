import express, { Router } from 'express';
import { API_BASE_PATH, DEBUG_MODE } from '../config';
import authRouter from './auth/auth.router';
import productRouter from './product/product.router';
import cartRouter from './cart/cart.router';
import discountCodeRouter from './discountCode/discountCode.router';
import adminRouter from './admin/admin.router';

export class RoutingServicesWithUtils {
  private app: express.Express;
  private routers: Record<string, Router>;
  constructor(app: express.Express) {
    this.app = app;
    // register routes here from each modules
    this.routers = {
      admin: adminRouter,
      auth: authRouter,
      product: productRouter,
      cart: cartRouter,
      discount: discountCodeRouter,
    };
  }

  public createRouterFromExpressApp() {
    for (const key in this.routers) {
      const path = `${API_BASE_PATH}/${key}`;
      if (DEBUG_MODE) {
        console.log(`<----route:${path} available---->`);
      }
      this.app.use(path, this.routers[key]);
    }
  }
}
