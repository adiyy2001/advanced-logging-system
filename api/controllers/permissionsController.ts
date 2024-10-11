import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { Role, PermissionsForRole } from '../../types/roles';
import PermissionManager from '../../core/auth';
import { Route } from '../../core/decorators';

function isValidRole(role: string): role is Role {
  return ['User', 'Manager', 'Admin', 'RestrictedUser'].includes(role);
}

type AssignRoleRequestBody<T extends Role> = {
  userId: string;
  newRole: T;
};

type AssignRoleResponse<T extends Role> = {
  message: string;
  userId: string;
  assignedRole: T;
};

type CheckPermissionsResponse<T extends Role> = {
  role: T;
  permissions: PermissionsForRole<T>;
  accessInfo?: string;
};

const permissionManager = new PermissionManager();

class PermissionsController {
  @Route('/assign-role', 'put', ['Admin'])
  static assignRole(req: Request, res: Response) {
    const requesterRole = req.headers.role;

    if (!isValidRole(requesterRole as string)) {
      res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid requester role' });
      return;
    }

    try {
      permissionManager.canManageUsers(requesterRole as 'Admin');
    } catch {
      res.status(httpStatus.FORBIDDEN).json({ error: 'Access denied' });
      return;
    }

    const { userId, newRole } = req.body as AssignRoleRequestBody<Role>;

    if (!isValidRole(newRole)) {
      res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid role to assign' });
      return;
    }

    const accessInfo = PermissionsController.advancedRoleCheck(newRole);
    const response: AssignRoleResponse<Role> = {
      message: `Role '${newRole}' assigned to user '${userId}' (simulated). ${accessInfo}`,
      userId,
      assignedRole: newRole,
    };

    res.status(httpStatus.OK).json(response);
  }

  @Route('/check-permissions', 'get', ['User', 'Manager', 'Admin', 'RestrictedUser'])
  static checkPermissions(req: Request, res: Response) {
    const roleParam = req.query.role;

    if (!isValidRole(roleParam as string)) {
      res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid role' });
      return;
    }

    const role = roleParam as Role;

    try {
      const permissions = permissionManager.getPermissionsForRole(role);
      const accessInfo = PermissionsController.advancedRoleCheck(role);
      const response: CheckPermissionsResponse<Role> = {
        role,
        permissions,
        accessInfo,
      };
      res.status(httpStatus.OK).json(response);
    } catch {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Error retrieving permissions' });
    }
  }

  @Route('/access-level', 'get', ['User', 'Manager', 'Admin', 'RestrictedUser'])
  static getAccessLevel(req: Request, res: Response) {
    const roleParam = req.query.role;

    if (!isValidRole(roleParam as string)) {
      res.status(httpStatus.BAD_REQUEST).json({ error: 'Invalid role' });
      return;
    }

    const role = roleParam as Role;
    const accessInfo = PermissionsController.advancedRoleCheck(role);

    res.status(httpStatus.OK).json({ role, accessInfo });
  }

  static advancedRoleCheck<R extends Role>(role: R): string {
    const accessLevels = {
      Admin: 'Full Access',
      Manager: 'Partial Access',
      User: 'Limited Access',
      RestrictedUser: 'Limited Access',
    } as const;

    type AccessLevel = (typeof accessLevels)[R];
    const accessLevel: AccessLevel = accessLevels[role];

    return `Role ${role} has ${accessLevel}`;
  }
}

export default PermissionsController;
