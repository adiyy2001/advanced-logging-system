import { Request, Response } from 'express';
import httpStatus from 'http-status';
import PermissionManager from '../../../core/auth';
import { Route } from '../../../core/decorators';
import logger from '../../../core/logger';
import { Role } from '../../../types/roles';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: Role;
}

const mockProfiles: UserProfile[] = [
  {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    role: 'User',
  },
  {
    id: 2,
    name: 'Bob',
    email: 'bob@example.com',
    role: 'Manager',
  },
  {
    id: 3,
    name: 'Charlie',
    email: 'charlie@example.com',
    role: 'Admin',
  },
];

export default class ProfileController {
  private permissionManager: PermissionManager;

  constructor() {
    this.permissionManager = new PermissionManager();
  }

  @Route('/profile', 'get', ['User', 'Manager', 'Admin', 'RestrictedUser'])
  public getProfile(req: Request, res: Response): void {
    const role = req.headers['x-role'] as Role;
    const userId = parseInt(req.headers['x-user-id'] as string, 10);
    console.log(role);

    if (!this.permissionManager.hasPermission(role, 'canViewProfile')) {
      res.status(httpStatus.FORBIDDEN).send('Access denied');
      logger.roleLogger[role]('Attempt to view profile without permission', 'Warning');
      return;
    }

    const profile = mockProfiles.find((user) => user.id === userId);

    if (profile) {
      res.status(httpStatus.OK).json(profile);
      logger.roleLogger[role]('Profile viewed', 'Info');
    } else {
      res.status(httpStatus.NOT_FOUND).send('Profile not found');
      logger.roleLogger[role]('Profile not found', 'Warning');
    }
  }

  @Route('/profile', 'put', ['Manager', 'Admin'])
  public editProfile(req: Request, res: Response): void {
    const role = req.headers['x-role'] as Role;
    const userId = parseInt(req.headers['x-user-id'] as string, 10);

    if (!this.permissionManager.hasPermission(role, 'canEditProfile')) {
      res.status(httpStatus.FORBIDDEN).send('Access denied');
      logger.roleLogger[role]('Attempt to edit profile without permission', 'Warning');
      return;
    }

    const profileIndex = mockProfiles.findIndex((user) => user.id === userId);

    if (profileIndex >= 0) {
      const updatedData = req.body;
      mockProfiles[profileIndex] = { ...mockProfiles[profileIndex], ...updatedData };
      res.status(httpStatus.OK).json(mockProfiles[profileIndex]);
      logger.roleLogger[role]('Profile edited', 'Info');
    } else {
      res.status(httpStatus.NOT_FOUND).send('Profile not found');
      logger.roleLogger[role]('Profile not found', 'Warning');
    }
  }
}
