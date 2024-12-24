import { RouteDefinition } from '../../utils/dto/general';

export const GLOBAL_ROUTES: Array<{ className: string; route: RouteDefinition }> = [];

export function Route(route: RouteDefinition) {
  
  return function (target: any, propertyKey: string) {
    GLOBAL_ROUTES.push({
      className: target.constructor.name,
      route: { ...route, handler: propertyKey },
    });
  };
}
