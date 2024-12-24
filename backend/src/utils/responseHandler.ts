import { Response } from 'express';
import { HttpStatusCodes } from '../const/constant';
import { PaginatedResponse } from './dto/general';

export interface SuccessResponseOptions<T = any> {
  res: Response;
  data: T;
  message?: any | undefined;
  statusCode?: number;
  paginated?: boolean;
  paginationDetails?: Omit<PaginatedResponse<T>, 'data'> | undefined;
  language?: string | undefined;
}

interface ErrorResponseOptions {
  res: Response;
  message: any | undefined;
  statusCode?: number;
  language?: string | undefined;
}

class ResponseHandler {
  public defaultLanguage: string | any;
  constructor() {
    this.defaultLanguage = 'en';
  }
  public success<T = any>(options: SuccessResponseOptions<T>) {
    let response = {
      success: true,
      data: options.data,
      message: options.message?.[options.language ?? this.defaultLanguage] || 'Operation completed successfully.',
      timestamp: new Date().toISOString(),
    };
    if (options.paginated && options.paginationDetails !== undefined) {
      response = {
        ...response,
        ...options.paginationDetails,
      };
    }
    return options.res.status(options.statusCode || HttpStatusCodes.STATUS_OK.value).json(response);
  }

  public error(options: ErrorResponseOptions) {
    const response = {
      success: false,
      data: null,
      message: options.message?.[options.language ?? this.defaultLanguage] || 'Something Went Wrong',
      timestamp: new Date().toISOString(),
    };
    
    return options.res.status(options.statusCode || 400).json(response);
  }
}

export default ResponseHandler;
