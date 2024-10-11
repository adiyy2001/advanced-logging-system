import { Role, roleModules, Module } from './roles';

export function hasAccess(role: Role, module: Module): boolean {
  return roleModules[role].includes(module);
}

export function verifyAccess<R extends Role, M extends Module>(role: R, module: M): boolean {
  return roleModules[role].includes(module);
}
