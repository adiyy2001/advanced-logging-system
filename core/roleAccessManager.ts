import * as roles from '../types/roles';
import { AccessibleRoutes } from '../types/roles';
import logger from './logger';

export default class RoleAccessManager {
  private role: roles.Role;

  constructor(role: roles.Role) {
    this.role = role;
  }

  public loadComponent(path: roles.Path): roles.Module | undefined {
    const rolePaths = RoleAccessManager.getRolePaths(this.role);

    const accessiblePaths = Object.values(rolePaths) as roles.Path[];
    if (accessiblePaths.includes(path)) {
      return RoleAccessManager.getModuleFromPath(path);
    }

    logger.roleLogger[this.role](`Access denied to path: ${path}`, 'Warning');
    return undefined;
  }

  private static getRolePaths<R extends roles.Role>(role: R): AccessibleRoutes<R> {
    const accessibleModules = roles.roleModules[role];

    const paths = accessibleModules.reduce((acc, module) => {
      acc[module as keyof AccessibleRoutes<R>] = roles.routePaths[module];
      return acc;
    }, {} as AccessibleRoutes<R>);

    return paths;
  }

  private static getModuleFromPath(path: roles.Path): roles.Module | undefined {
    const moduleName = Object.keys(roles.routePaths).find(
      (key) => roles.routePaths[key as roles.Module] === path,
    ) as roles.Module;

    return moduleName;
  }
}
