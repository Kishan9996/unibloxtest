import { Request, Response } from 'express';
import { ApplicationNames, HttpStatusCodes } from '../../const/constant';
import { Route } from '../../infrastructure/decorators/routingDecorators';
import { BaseRouter } from '../../infrastructure/base/baseRouterWithController';
import { zodSchemaValidator } from '../../infrastructure/middlewares/schemaMiddleware';

import { authenticationMiddleware } from '../../infrastructure/middlewares/authMiddleware';
import { ProductServices } from '../../application/product/product.services';
import schema, { ProductCreateSchemaType } from './schema';
import paginatedSchema from '../../utils/general/schema';
import { CommonPaginationRequestOptions, RoleType } from '../../utils/dto/general';
import { requireRoleMiddleware } from '../../infrastructure/middlewares/rollBasedMiddleware';

export class ProductController extends BaseRouter {
  private productServices: ProductServices;
  constructor() {
    super({ applicationName: ApplicationNames.Product, middlewares: [] });
    this.productServices = new ProductServices();
  }

  @Route({
    method: 'get',
    path: '/list',
    middlewares: [
      zodSchemaValidator({
        schema: paginatedSchema,
        validateQuery: true,
      }),
    ],
  })
  async listProducts(req: Request<{}, {}, {}, CommonPaginationRequestOptions>, res: Response) {
    try {
      const queryParams = req.query;
      const { data, totalPages, totalRecords, currentPage } =
        await this.productServices.fetchPaginatedProducts(queryParams);
      return this.responseHandler.success({
        res,
        data,
        message: this.responseMessages.success.products_fetch_success,
        paginationDetails: { totalPages, totalRecords, currentPage },
        paginated: true,
        statusCode: HttpStatusCodes.STATUS_OK.value,
      });
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.data_not_found,
        statusCode: HttpStatusCodes.STATUS_NOT_MODIFIED.value,
      });
    }
  }

  @Route({
    method: 'post',
    path: '/add',
    middlewares: [
      authenticationMiddleware,
      requireRoleMiddleware([RoleType.ADMIN]),
      zodSchemaValidator({
        schema: schema.productCreateSchema,
        validateQuery: false,
      }),
    ],
  })
  async createProduct(req: Request<{}, {}, ProductCreateSchemaType, {}>, res: Response) {
    try {
      const createdProduct = await this.productServices.createProduct(req.body);
      if (createdProduct) {
        return this.responseHandler.success({
          res,
          data: {},
          message: this.responseMessages.success.product_created,
          statusCode: HttpStatusCodes.STATUS_OK.value,
        });
      } else {
        return this.responseHandler.error({
          res,
          message: this.responseMessages.error.product_create_error,
          statusCode: HttpStatusCodes.STATUS_BAD_REQUEST.value,
        });
      }
    } catch (error) {
      return this.responseHandler.error({
        res,
        message: this.responseMessages.error.product_create_error,
      });
    }
  }

}
