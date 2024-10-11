import { hasAccess } from '../permissions';

describe('hasAccess', () => {
  test('User has access to ProfileModule', () => {
    expect(hasAccess('User', 'ProfileModule')).toBe(true);
  });

  test('Manager has access to ReportsModule', () => {
    expect(hasAccess('Manager', 'ReportsModule')).toBe(true);
  });

  test('Admin has access to SettingsModule', () => {
    expect(hasAccess('Admin', 'SettingsModule')).toBe(true);
  });

  test('User does not have access to UserManagementModule', () => {
    expect(hasAccess('User', 'UserManagementModule')).toBe(false);
  });
});
