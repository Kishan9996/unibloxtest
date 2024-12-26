import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { requireRoleMiddleware } from '../../infrastructure/middlewares/rollBasedMiddleware';
import { RoleType } from '../../utils/dto/general';
import { UserServices } from '../../application/user';
import { DiscountCodeServices } from '../../application/discountCode';

export class AdminController extends BaseRouter {
  private userServices: UserServices;
  private discountCodeServices: DiscountCodeServices;

  constructor() {
    super({
      applicationName: ApplicationNames.Admin,
      middlewares: [authenticationMiddleware, requireRoleMiddleware([RoleType.ADMIN])],
    });
    this.userServices = new UserServices();
    this.discountCodeServices = new DiscountCodeServices();
  }

  @Route({
    method: 'get',
    path: '/list-users',
    middlewares: [requireRoleMiddleware([RoleType.ADMIN])],
  })
  async fetchUsers(req: Request, res: Response) {
    try {
      const userDetails = await this.userServices.fetchUserDetailsForAdmin();
      if (userDetails) {
        return this.responseHandler.success({
          res,
          data: userDetails,
          message: this.responseMessages.success.admin_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.admin_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.admin_create_error,
      });
    }
  }

  @Route({
    method: 'get',
    path: '/discount/list',
    middlewares: [],
  })
  async fetchDiscountCode(req: Request, res: Response) {
    try {
      const fetchDiscountCodes = await this.discountCodeServices.fetchDiscountCodesWithUserForAdmin();
      return this.responseHandler.success({
        res,
        data: fetchDiscountCodes,
        message: this.responseMessages.success.admin_created,
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.admin_create_error,
      });
    }
  }
}
