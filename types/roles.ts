export type Role = 'User' | 'Manager' | 'Admin' | 'RestrictedUser';

export type DetailedPermissions = {
  canViewProfile: boolean;
  canEditProfile?: boolean;
  canReport?: boolean;
  canManageUsers?: boolean;
};

export type RolePermissions = {
  User: { canViewProfile: true };
  Manager: { canViewProfile: true; canEditProfile: true; canReport: true };
  Admin: { canViewProfile: true; canEditProfile: true; canReport: true; canManageUsers: true };
  RestrictedUser: { canViewProfile: false };
};

export type PermissionsForRole<T extends Role> = RolePermissions[T];

export type CanEdit<T extends Role> = 'canEditProfile' extends keyof PermissionsForRole<T>
  ? PermissionsForRole<T>['canEditProfile']
  : false;

export type RoleUnion<T extends Role, U extends Role> = PermissionsForRole<T> & PermissionsForRole<U>;

export type HasAnyPermission<
  T extends Role,
  U extends Role,
  P extends keyof PermissionsForRole<T> & keyof PermissionsForRole<U>,
> = PermissionsForRole<T>[P] | PermissionsForRole<U>[P];

export type Path = '/profile' | '/dashboard' | '/reports' | '/user-management' | '/settings';

export type Module = 'ProfileModule' | 'DashboardModule' | 'ReportsModule' | 'UserManagementModule' | 'SettingsModule';

export type RoleModules = {
  User: Extract<Module, 'ProfileModule' | 'DashboardModule'>;
  Manager: Extract<Module, 'ProfileModule' | 'DashboardModule' | 'ReportsModule'>;
  Admin: Module;
};

export type RoutePaths = {
  [K in Module]: K extends 'ProfileModule'
    ? '/profile'
    : K extends 'DashboardModule'
      ? '/dashboard'
      : K extends 'ReportsModule'
        ? '/reports'
        : K extends 'UserManagementModule'
          ? '/user-management'
          : K extends 'SettingsModule'
            ? '/settings'
            : never;
};

export const roleModules: Record<Role, Module[]> = {
  User: ['ProfileModule', 'DashboardModule'],
  Manager: ['ProfileModule', 'DashboardModule', 'ReportsModule'],
  Admin: ['ProfileModule', 'DashboardModule', 'ReportsModule', 'UserManagementModule', 'SettingsModule'],
  RestrictedUser: ['ProfileModule'],
};

export const routePaths: Record<Module, Path> = {
  ProfileModule: '/profile',
  DashboardModule: '/dashboard',
  ReportsModule: '/reports',
  UserManagementModule: '/user-management',
  SettingsModule: '/settings',
};

export type AccessibleRoutes<R extends Role> = {
  [K in Module as K extends (typeof roleModules)[R][number] ? K : never]: (typeof routePaths)[K];
};

export function getPathForModule(module: Module): Path {
  return routePaths[module];
}
