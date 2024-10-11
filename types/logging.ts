import { Role } from './roles';

export type LogLevel = 'Info' | 'Warning' | 'Error' | 'Critical';

export type RoleLogLevelMap = {
  User: 'Info' | 'Warning';
  Manager: 'Info' | 'Warning' | 'Error';
  Admin: LogLevel;
  RestrictedUser: 'Info' | 'Warning';
};

export type DiscriminatedLogEntry =
  | { role: 'User'; level: RoleLogLevelMap['User']; message: string; timestamp: Date }
  | { role: 'Manager'; level: RoleLogLevelMap['Manager']; message: string; timestamp: Date }
  | { role: 'Admin'; level: RoleLogLevelMap['Admin']; message: string; timestamp: Date }
  | { role: 'RestrictedUser'; level: RoleLogLevelMap['RestrictedUser']; message: string; timestamp: Date };

export type LogLevelsByRole<R extends Role> = R extends 'Admin'
  ? 'Info' | 'Warning' | 'Error' | 'Critical'
  : R extends 'Manager'
    ? 'Info' | 'Warning' | 'Error'
    : R extends 'User' | 'RestrictedUser'
      ? 'Info' | 'Warning'
      : never;

export function isLogLevelAllowed<R extends Role>(role: R, level: LogLevel): boolean {
  const allowedLevels = {
    User: ['Info', 'Warning'],
    Manager: ['Info', 'Warning', 'Error'],
    Admin: ['Info', 'Warning', 'Error', 'Critical'],
    RestrictedUser: ['Info', 'Warning'],
  };

  return allowedLevels[role].includes(level);
}

export function isManagerLog(
  entry: DiscriminatedLogEntry,
): entry is Extract<DiscriminatedLogEntry, { role: 'Manager' }> {
  return entry.role === 'Manager';
}
