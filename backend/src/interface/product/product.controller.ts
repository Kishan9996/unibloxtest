import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';

import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';

export class ProductController extends BaseRouter {

  constructor() {
    super({ applicationName: ApplicationNames.Product, middlewares: [authenticationMiddleware] });
  }


  

}
