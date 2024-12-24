import express, { Router } from 'express';
import { API_BASE_PATH, DEBUG_MODE } from '../config';
import authRouter from './auth/auth.router';
export class RoutingServicesWithUtils {
  private app: express.Express;
  private routers: Record<string, Router>;
  constructor(app: express.Express) {
    this.app = app;
    // register routes here from each modules
    this.routers = {
      auth: authRouter,
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
