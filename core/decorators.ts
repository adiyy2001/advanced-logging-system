/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { Role } from '../types/roles';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export function Route(path: string, method: HttpMethod, roles: Role[]) {
  return function routeDecorator(target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.constructor.routes) {
      target.constructor.routes = [];
    }

    const fullPath = `/api/v1${path}`;
    target.constructor.routes.push({ path: fullPath, method, roles, handler: descriptor.value });
  };
}

export function InjectRole(role: Role) {
  return function (target: object, propertyKey: string | symbol, parameterIndex: number) {
    // Pobranie istniejących ról lub zainicjalizowanie nowej tablicy
    const existingRoles = Reflect.getOwnMetadata('roles', target, propertyKey) || [];
    existingRoles[parameterIndex] = role;
    Reflect.defineMetadata('roles', existingRoles, target, propertyKey);
  };
}
