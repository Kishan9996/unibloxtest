import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';
import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import schema, {
  CheckOutSchemaType,
  ProductAddTOCartSchemaType,
  ProductRemoveTOCartSchemaType,
  UpdateCartItemSchemaType,
} from './schema';
import { CartServices } from '../../application/cart';

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
      const createdCartItem = await this.cartServices.addToCart(req.body, req.user);
      if (createdCartItem) {
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
    method: 'post',
    path: '/remove-item',
    middlewares: [
      zodSchemaValidator({
        schema: schema.productRemoveTOCartSchema,
        validateQuery: false,
      }),
    ],
  })
  async removeToCart(req: Request<{}, {}, ProductRemoveTOCartSchemaType, {}>, res: Response) {
    try {
      const removedCartItem = await this.cartServices.removeToCart(req.body, req.user);
      if (removedCartItem) {
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
    method: 'patch',
    path: '/update-quantity',
    middlewares: [
      zodSchemaValidator({
        schema: schema.updateCartItemSchema,
        validateQuery: false,
      }),
    ],
  })
  async updateQuantity(req: Request<{}, {}, UpdateCartItemSchemaType, {}>, res: Response) {
    try {
      const updatedCartItem = await this.cartServices.updateQuantityToCartItem(req.body, req.user);
      if (updatedCartItem) {
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
    path: '/cart-items',
    middlewares: [],
  })
  async getCartWithItems(req: Request<{}, {}, ProductAddTOCartSchemaType, {}>, res: Response) {
    try {
      const getCartItems = await this.cartServices.getCartWithItems(req.user);
      return this.responseHandler.success({
        res,
        data: getCartItems,
        message: this.responseMessages.success.cart_created,
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.cart_create_error,
      });
    }
  }

  @Route({
    method: 'post',
    path: '/checkout',
    middlewares: [
      zodSchemaValidator({
        schema: schema.checkOutSchema,
        validateQuery: false,
      }),
    ],
  })
  async checkOut(req: Request<{}, {}, CheckOutSchemaType, {}>, res: Response) {
    try {
      const user: any = req.user;
      const checkout = await this.cartServices.checkoutCart(req.body, user);
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

  @Route({
    method: 'get',
    path: '/clear-cart/:id',
    middlewares: [

    ],
  })
  async clearCart(req: Request, res: Response) {
    try {
      const user: any = req.user;
      const clear = await this.cartServices.clearCartItems(req.params.id, user.id);
      if (clear) {
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
