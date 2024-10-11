import { Request, Response, NextFunction } from 'express';
import logger from '../../core/logger';
import { Role } from '../../types/roles';

const globalAccessLogger = (req: Request, res: Response, next: NextFunction) => {
  const role = (req.headers['x-role'] as Role) || 'Unknown';
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const path = req.originalUrl;
  const { method } = req;

  const start = Date.now();

  if (process.env.NODE_ENV !== 'test') {
    logger.roleLogger[role](`Request: ${method} ${path} from IP: ${ip}`, 'Info');
  }

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const logLevel = status >= 400 ? 'Warning' : 'Info';

    if (process.env.NODE_ENV !== 'test') {
      logger.roleLogger[role](
        `Response: ${method} ${path} with status ${status} in ${duration}ms from IP: ${ip}`,
        logLevel,
      );
    }
  });

  next();
};

export default globalAccessLogger;
