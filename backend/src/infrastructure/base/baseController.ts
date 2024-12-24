import { ApplicationNames } from '../../const/constant';
import ResponseHandler from '../../utils/responseHandler';

/**
 * Represents a base controller with the provided application name.
 * Binds all class methods to the instance to maintain correct context.
 */
export class BaseController {
  public applicationName: ApplicationNames | undefined;
  public responseHandler: ResponseHandler;
  public responseMessages: any;
  constructor(applicationName: ApplicationNames | undefined = undefined) {
    this.responseMessages = {};
    if (applicationName) {
      this.applicationName = applicationName;
      this.init();
    }
    this.methodBinder();
    this.responseHandler = new ResponseHandler();
  }
  private async init() {
    try {
      const importedModule = await import(`../../interface/${this.applicationName}/response.messages`);
      this.responseMessages = importedModule.response;
    } catch (error) {
      throw error;
    }
  }

  methodBinder() {
    try {
      const methodNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
      for (const method of methodNames) {
        if (method !== 'constructor' && typeof (this as any)[method] === 'function') {
          (this as any)[method] = (this as any)[method].bind(this);
        }
      }
    } catch (error) {
      throw error;
    }
  }
}
