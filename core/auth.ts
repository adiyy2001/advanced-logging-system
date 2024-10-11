import { Role, PermissionsForRole, RolePermissions } from '../types/roles';

const ROLE_PERMISSIONS: RolePermissions = {
  User: { canViewProfile: true },
  Manager: { canViewProfile: true, canEditProfile: true, canReport: true },
  Admin: {
    canViewProfile: true,
    canEditProfile: true,
    canReport: true,
    canManageUsers: true,
  },
  RestrictedUser: { canViewProfile: false },
};

type PermissionKey = 'canViewProfile' | 'canEditProfile' | 'canReport' | 'canManageUsers';

class PermissionManager {
  private permissions: RolePermissions;

  constructor() {
    this.permissions = ROLE_PERMISSIONS;
  }

  getPermissionsForRole<T extends Role>(role: T): PermissionsForRole<T> {
    const rolePermissions = this.permissions[role];
    if (!rolePermissions) {
      throw new Error(`Access denied: ${role} has no defined permissions`);
    }
    return rolePermissions;
  }

  hasPermission(role: Role, permission: PermissionKey): boolean {
    const permissions = this.getPermissionsForRole(role) as Record<string, boolean>;
    return permissions[permission] ?? false;
  }

  canViewProfile(role: Role): boolean {
    if (!this.hasPermission(role, 'canViewProfile')) {
      throw new Error(`Access denied: ${role} cannot view profile`);
    }
    return true;
  }

  canEditProfile(role: 'Manager' | 'Admin'): boolean {
    if (!this.hasPermission(role, 'canEditProfile')) {
      throw new Error(`Access denied: ${role} cannot edit profile`);
    }
    return true;
  }

  canManageUsers(role: 'Admin'): boolean {
    if (!this.hasPermission(role, 'canManageUsers')) {
      throw new Error(`Access denied: ${role} cannot manage users`);
    }
    return true;
  }
}

export default PermissionManager;
