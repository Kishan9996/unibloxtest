import { RequestHandler, Router } from 'express';
import { ApplicationNames } from '../../const/constant';
import ResponseHandler from '../../utils/responseHandler';
import { GLOBAL_ROUTES } from '../decorators/routingDecorators';

export const ROUTE_METADATA = Symbol('route_metadata');

interface BaseRouterOptions {
  middlewares: RequestHandler[];
  applicationName: ApplicationNames | undefined;
}
export abstract class BaseRouter {
  private _router: Router | null = null;
  private _initialized = false; // Safeguard to prevent double registration

  public applicationName: ApplicationNames | undefined;
  public responseHandler: ResponseHandler;
  public responseMessages: any;
  constructor(private options: BaseRouterOptions) {
    this.responseMessages = {};
    if (options.applicationName) {
      this.applicationName = options.applicationName;
      this.init();
    }
    this.responseHandler = new ResponseHandler();
  }
  private async init() {
    try {
      const importedModule = await import(`../../interface/${this.applicationName}/response.messages`);
      this.responseMessages = importedModule.response;
      await this.registerRoutesAsync();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public get router(): Router {
    if (!this._router) {
      this._router = Router();
      this.registerRoutes();
    }
    return this._router;
  }
  private registerRoutes(): void {
    if (this._initialized) {
      return;
    }
    const className = this.constructor.name;
    GLOBAL_ROUTES.forEach(({ className: registeredClass, route }) => {
      if (registeredClass === className) {
        const handler = (this as any)[route.handler!]; // Access the route handler
        if (typeof handler === 'function') {
          const routeMiddlewares = route.middlewares || [];
          this._router![route.method](
            route.path,
            ...this.options.middlewares, // Apply class-level middlewares first
            ...routeMiddlewares, // Then apply route-specific middlewares
            handler.bind(this) // Finally, call the route handler
          );
        }
      }
    });
    this._initialized = true; // Mark as initialized
  }

  // not working
  private async registerRoutesAsync(): Promise<void> {
    if (this._initialized) {
      return;
    }

    const className = this.constructor.name;
    await Promise.all(
      GLOBAL_ROUTES.map(async ({ className: registeredClass, route }) => {
        if (registeredClass === className) {
          const handler = (this as any)[route.handler!]; // Access the route handler
          if (typeof handler === 'function') {
            const routeMiddlewares = route.middlewares || [];
            this._router![route.method](
              route.path,
              ...this.options.middlewares, // Apply class-level middlewares first
              ...routeMiddlewares, // Then apply route-specific middlewares
              handler.bind(this) // Finally, call the route handler
            );
          }
        }
      })
    );
    this._initialized = true; // Mark as initialized
  }
}
