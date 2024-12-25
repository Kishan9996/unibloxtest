import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { requireRoleMiddleware } from '../../infrastructure/middlewares/rollBasedMiddleware';
import { RoleType } from '../../utils/dto/general';
import { UserServices } from '../../application/user';

export class AdminController extends BaseRouter {
  private userServices: UserServices;
  constructor() {
    super({
      applicationName: ApplicationNames.Admin,
      middlewares: [authenticationMiddleware, requireRoleMiddleware([RoleType.ADMIN])],
    });
    this.userServices = new UserServices();
  }

  @Route({
    method: 'get',
    path: '/list',
    middlewares: [requireRoleMiddleware([RoleType.ADMIN])],
  })
  async fetchDiscountCode(req: Request, res: Response) {
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
}
