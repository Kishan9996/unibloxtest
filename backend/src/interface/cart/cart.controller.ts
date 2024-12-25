import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';

import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { CartServices } from '../../application/cart/cart.services';
import schema, { ProductAddTOCartSchemaType } from './schema';

export class CartController extends BaseRouter {
  private cartServices: CartServices;
  constructor() {
    super({ applicationName: ApplicationNames.Cart, middlewares: [authenticationMiddleware] });
    this.cartServices = new CartServices();
  }

  @Route({
    method: 'post',
    path: '/add',
    middlewares: [
      zodSchemaValidator({
        schema: schema.productAddTOCartSchema,
        validateQuery: false,
      }),
    ],
  })
  async addToCart(req: Request<{}, {}, ProductAddTOCartSchemaType, {}>, res: Response) {
    try {
      const createdCartItems = await this.cartServices.addToCart(req.body, req.user);
      if (createdCartItems) {
        return this.responseHandler.success({
          res,
          data: {},
          message: this.responseMessages.success.cart_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.cart_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.cart_create_error,
      });
    }
  }
  @Route({
    method: 'get',
    path: '/checkout/:id',
    middlewares: [
      zodSchemaValidator({
        schema: schema.productAddTOCartSchema,
        validateQuery: false,
      }),
    ],
  })
  async checkOut(req: Request<{ id: string }, {}, {}, {}>, res: Response) {
    try {
      const { id } = req.params;

      const checkout = await this.cartServices.checkoutCart(id, req.user);
      if (checkout) {
        return this.responseHandler.success({
          res,
          data: {},
          message: this.responseMessages.success.cart_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.cart_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.cart_create_error,
      });
    }
  }
}
