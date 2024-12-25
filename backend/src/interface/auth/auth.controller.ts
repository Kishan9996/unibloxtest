import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { AuthServices } from '../../application/auth';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';
import schema, { LoginSchemaType, UserSignUpSchemaType } from './schema';
import { UserServices } from '../../application/user';

export class AuthController extends BaseRouter {
  private authServices: AuthServices;
  private userServices: UserServices;

  constructor() {
    super({ applicationName: ApplicationNames.Authentication, middlewares: [] });
    this.authServices = new AuthServices();
    this.userServices = new UserServices();
  }

  @Route({
    method: 'post',
    path: '/admin/login',
    middlewares: [
      zodSchemaValidator({
        schema: schema.loginSchema,
        validateQuery: false,
      }),
    ],
  })
  async adminLogin(req: Request<{}, {}, LoginSchemaType>, response: Response) {
    try {
      const { email, password } = req.body;
      const data = await this.authServices.adminLogin({ email, password });
      if (!data?.isLoggedIn) {
        return this.responseHandler.error({
          res: response,
          message: this.responseMessages.error.user_not_exists,
          statusCode: HttpStatusCodes.STATUS_UNAUTHORIZED.value,
        });
      }
      // login the user
      return this.responseHandler.success<any>({
        res: response,
        message: this.responseMessages.success.admin_logged_in,
        data,
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res: response,
        message: this.responseMessages.error.user_un_authorized,
        statusCode: HttpStatusCodes.STATUS_UNAUTHORIZED.value,
      });
    }
  }

  @Route({
    method: 'post',
    path: '/login',
    middlewares: [
      zodSchemaValidator({
        schema: schema.loginSchema,
        validateQuery: false,
      }),
    ],
  })
  async login(req: Request<{}, {}, LoginSchemaType>, response: Response) {
    try {
      const { email, password } = req.body;
      const data = await this.authServices.userLogin({ email, password });
      if (!data?.isLoggedIn) {
        return this.responseHandler.error({
          res: response,
          message: this.responseMessages.error.user_not_exists,
          statusCode: HttpStatusCodes.STATUS_UNAUTHORIZED.value,
        });
      }
      return this.responseHandler.success<any>({
        res: response,
        message: this.responseMessages.success.user_logged_in,
        data,
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res: response,
        message: this.responseMessages.error.user_un_authorized,
        statusCode: HttpStatusCodes.STATUS_UNAUTHORIZED.value,
      });
    }
  }

  @Route({
    method: 'post',
    path: '/sign-up',
    middlewares: [
      zodSchemaValidator({
        schema: schema.userSignUpSchema,
        validateQuery: false,
      }),
    ],
  })
  async signUp(req: Request<{}, {}, UserSignUpSchemaType>, response: Response) {
    try {
      const userInstance = await this.userServices.createUser(req.body);
      if (!userInstance) {
        return this.responseHandler.error({
          res: response,
          message: this.responseMessages.error.user_not_exists,
          statusCode: HttpStatusCodes.STATUS_UNAUTHORIZED.value,
        });
      }
      const loginSecrete = await this.userServices.creteLoginSecrete(userInstance.password ?? '');
      const { password, ...userDetails } = {
        ...userInstance,
        loginSecrete,
      };
      const tokens = this.authServices.generateJWTTokens({
        ...userDetails,
        role: 'USER',
      });
      // login the user
      await this.userServices.setLoginUser(userInstance.id, { loginSecrete });
      return this.responseHandler.success<any>({
        res: response,
        message: this.responseMessages.success.user_signup_success,
        data: { ...tokens, user: { ...userDetails } },
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res: response,
        message: this.responseMessages.error.user_not_created,
        statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
      });
    }
  }
}
