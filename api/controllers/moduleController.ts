import { Role, Module, getPathForModule } from '../../types/roles';
import { verifyAccess } from '../../types/permissions';
import { Route, InjectRole } from '../../core/decorators';

interface RouteInfo {
  path: string;
  roles: Role[];
  handler: (_role: Role) => void;
}

export default class ModuleController {
  static routes: RouteInfo[] = [
    {
      path: getPathForModule('ProfileModule'),
      roles: ['User', 'Manager', 'Admin'],
      handler: ModuleController.loadProfile,
    },
    {
      path: getPathForModule('UserManagementModule'),
      roles: ['Admin'],
      handler: ModuleController.loadUserManagement,
    },
    {
      path: getPathForModule('ReportsModule'),
      roles: ['Manager', 'Admin'],
      handler: ModuleController.loadReports,
    },
    {
      path: getPathForModule('SettingsModule'),
      roles: ['Admin'],
      handler: ModuleController.loadSettings,
    },
  ];

  @Route(getPathForModule('ProfileModule'), 'get', ['User', 'Manager', 'Admin'])
  static loadProfile(@InjectRole('User') role: Role) {
    ModuleController.handleAccess('ProfileModule', role);
  }

  @Route(getPathForModule('UserManagementModule'), 'get', ['Admin'])
  static loadUserManagement(@InjectRole('Admin') role: Role) {
    ModuleController.handleAccess('UserManagementModule', role);
  }

  @Route(getPathForModule('ReportsModule'), 'get', ['Manager', 'Admin'])
  static loadReports(@InjectRole('Manager') role: Role) {
    ModuleController.handleAccess('ReportsModule', role);
  }

  @Route(getPathForModule('SettingsModule'), 'get', ['Admin'])
  static loadSettings(@InjectRole('Admin') role: Role) {
    ModuleController.handleAccess('SettingsModule', role);
  }

  private static handleAccess(module: Module, role: Role) {
    if (verifyAccess(role, module)) {
      // Jeśli dostęp jest dozwolony, możesz wykonać dodatkowe akcje, jeśli potrzebne
    } else {
      throw new Error(`Access denied for role ${role} to module ${module}`);
    }
  }
}
