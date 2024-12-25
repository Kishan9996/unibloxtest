import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';
import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import schema, { ApproveDiscountCodeSchemaType } from './schema';
import { DiscountCodeServices } from '../../application/discountCode';
import { requireRoleMiddleware } from '../../infrastructure/middlewares/rollBasedMiddleware';
import { RoleType } from '../../utils/dto/general';

export class DiscountCodeController extends BaseRouter {
  private discountCodeServices: DiscountCodeServices;
  constructor() {
    super({ applicationName: ApplicationNames.DiscountCode, middlewares: [authenticationMiddleware] });
    this.discountCodeServices = new DiscountCodeServices();
  }

  @Route({
    method: 'get',
    path: '/apply',
    middlewares: [],
  })
  async applyForDiscountCode(req: Request, res: Response) {
    try {
      const applyForDiscount = await this.discountCodeServices.applyForDiscountCode(req.user);
      if (applyForDiscount) {
        return this.responseHandler.success({
          res,
          data: {},
          message: this.responseMessages.success.discountCode_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.discountCode_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.discountCode_create_error,
      });
    }
  }

  @Route({
    method: 'get',
    path: '/list',
    middlewares: [requireRoleMiddleware([RoleType.ADMIN])],
  })
  async fetchDiscountCode(req: Request, res: Response) {
    try {
      const fetchDiscountCodes = await this.discountCodeServices.fetchDiscountCodesWithUser();
      if (fetchDiscountCodes) {
        return this.responseHandler.success({
          res,
          data: fetchDiscountCodes,
          message: this.responseMessages.success.discountCode_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.discountCode_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.discountCode_create_error,
      });
    }
  }

  @Route({
    method: 'post',
    path: '/approve/:id',
    middlewares: [
      requireRoleMiddleware([RoleType.ADMIN]),
      zodSchemaValidator({
        schema: schema.approveDiscountCodeSchema,
        validateQuery: false,
      }),
    ],
  })
  async approveDiscountCode(req: Request<{}, {}, ApproveDiscountCodeSchemaType, {}>, res: Response) {
    try {
      const applyForDiscount = await this.discountCodeServices.approveForDiscountCode(req.body);
      if (applyForDiscount) {
        return this.responseHandler.success({
          res,
          data: {},
          message: this.responseMessages.success.discountCode_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.discountCode_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.discountCode_create_error,
      });
    }
  }
}
