import { Router, Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { Role } from '../types/roles';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

interface RouteInfo {
  path: string;
  method: HttpMethod;
  roles: Role[];
  handler: (req: Request, res: Response, next: NextFunction) => void;
}

interface ControllerWithRoutes {
  constructor: {
    routes?: RouteInfo[];
  };
}

export default function createDynamicRouter(controller: ControllerWithRoutes): Router {
  const router = Router();
  const { routes } = controller.constructor;

  if (!routes) {
    console.warn('No routes defined for this controller');
    return router;
  }

  routes.forEach(({ path, method, roles, handler }) => {
    console.log(`Creating route - Method: ${method.toUpperCase()}, Path: ${path}, Roles: [${roles.join(', ')}]`);

    const routeExists = router.stack.some(
      (layer) =>
        layer.route?.path === path &&
        layer.route?.stack.some(
          (routeLayer: { handle: unknown; method: string }) => routeLayer.handle && routeLayer.method === method,
        ),
    );

    if (!routeExists) {
      router[method](path, (req: Request, res: Response, next: NextFunction): void => {
        const userRole = req.headers['x-role'] as Role;
        console.log('User role:', userRole);

        if (!roles.includes(userRole)) {
          res.status(httpStatus.FORBIDDEN).send('Access denied');
          return;
        }

        handler.call(controller, req, res, next);
      });
    } else {
      console.warn(`Route already exists - Method: ${method.toUpperCase()}, Path: ${path}`);
    }
  });

  return router;
}
