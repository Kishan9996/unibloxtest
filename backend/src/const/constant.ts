export enum ApplicationNames {
  User = 'user',
  Admin = 'admin',
  Authentication = 'auth',
  Product = 'product',
  Order = 'order'
}

export const HttpStatusCodes: { [key: string]: { value: number; description: string; usage: string } } = {
  STATUS_CONTINUE: {
    value: 100,
    description: 'Continue',
    usage: 'Indicates that the initial part of a request has been received and has not yet been rejected.',
  },
  STATUS_SWITCHING_PROTOCOLS: {
    value: 101,
    description: 'Switching Protocols',
    usage: 'Indicates the server is switching protocols as requested by the client.',
  },
  STATUS_OK: { value: 200, description: 'OK', usage: 'The request has succeeded.' },
  STATUS_CREATED: {
    value: 201,
    description: 'Created',
    usage: 'The request has been fulfilled and has resulted in a new resource being created.',
  },
  STATUS_ACCEPTED: {
    value: 202,
    description: 'Accepted',
    usage: 'The request has been accepted for processing, but the processing is not complete.',
  },
  STATUS_NO_CONTENT: {
    value: 204,
    description: 'No Content',
    usage: 'The server successfully processed the request, but is not returning any content.',
  },
  STATUS_MOVED_PERMANENTLY: {
    value: 301,
    description: 'Moved Permanently',
    usage: 'The requested resource has been permanently moved to a new URL.',
  },
  STATUS_FOUND: {
    value: 302,
    description: 'Found',
    usage: 'The requested resource resides temporarily under a different URL.',
  },
  STATUS_NOT_MODIFIED: {
    value: 304,
    description: 'Not Modified',
    usage: 'The resource has not been modified since the last request.',
  },
  STATUS_BAD_REQUEST: {
    value: 400,
    description: 'Bad Request',
    usage: 'The server cannot or will not process the request due to a client error.',
  },
  STATUS_UNAUTHORIZED: {
    value: 401,
    description: 'Unauthorized',
    usage: 'Authentication is required and has failed or has not yet been provided.',
  },
  STATUS_FORBIDDEN: {
    value: 403,
    description: 'Forbidden',
    usage: 'The server understood the request, but refuses to authorize it.',
  },
  STATUS_NOT_FOUND: { value: 404, description: 'Not Found', usage: 'The requested resource could not be found.' },
  STATUS_METHOD_NOT_ALLOWED: {
    value: 405,
    description: 'Method Not Allowed',
    usage: 'A request method is not supported for the requested resource.',
  },
  STATUS_CONFLICT: {
    value: 409,
    description: 'Conflict',
    usage: 'The request could not be completed due to a conflict with the current state of the resource.',
  },
  STATUS_GONE: {
    value: 410,
    description: 'Gone',
    usage: 'The requested resource is no longer available and will not be available again.',
  },
  STATUS_UNSUPPORTED_MEDIA_TYPE: {
    value: 415,
    description: 'Unsupported Media Type',
    usage: 'The server refuses to accept the request because the payload format is in an unsupported format.',
  },
  STATUS_TOO_MANY_REQUESTS: {
    value: 429,
    description: 'Too Many Requests',
    usage: 'The user has sent too many requests in a given amount of time.',
  },
  STATUS_INTERNAL_SERVER_ERROR: {
    value: 500,
    description: 'Internal Server Error',
    usage: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
  },
  STATUS_NOT_IMPLEMENTED: {
    value: 501,
    description: 'Not Implemented',
    usage: 'The server does not support the functionality required to fulfill the request.',
  },
  STATUS_SERVICE_UNAVAILABLE: {
    value: 503,
    description: 'Service Unavailable',
    usage: 'The server is currently unable to handle the request due to temporary overload or maintenance.',
  },
};
