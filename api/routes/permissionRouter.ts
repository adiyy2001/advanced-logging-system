import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import logger from '../../core/logger';
import { Role, Path } from '../../types/roles';
import RoleAccessManager from '../../core/roleAccessManager';

const router = Router();

router.get('/:path', (req: Request, res: Response) => {
  const role = req.headers['x-role'] as Role;
  const path = `/${req.params.path}` as Path;
  const appRouter = new RoleAccessManager(role);

  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const module = appRouter.loadComponent(path);

  if (module) {
    res.send(`Module loaded for ${path}`);
    logger.roleLogger[role](`Module loaded for ${path} by IP: ${ip}`, 'Info');
  } else {
    res.status(httpStatus.FORBIDDEN).send('Access denied');
    logger.roleLogger[role](`Access denied to ${path} by IP: ${ip}`, 'Warning');
  }
});

export default router;
