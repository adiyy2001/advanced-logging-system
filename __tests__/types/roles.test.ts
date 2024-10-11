import { hasAccess, verifyAccess } from '../permissions';

describe('hasAccess', () => {
  test('User has access to ProfileModule', () => {
    expect(hasAccess('User', 'ProfileModule')).toBe(true);
  });

  test('User does not have access to UserManagementModule', () => {
    expect(hasAccess('User', 'UserManagementModule')).toBe(false);
  });

  test('Admin has access to SettingsModule', () => {
    expect(hasAccess('Admin', 'SettingsModule')).toBe(true);
  });

  test('Manager has access to ReportsModule', () => {
    expect(hasAccess('Manager', 'ReportsModule')).toBe(true);
  });

  test('Manager does not have access to SettingsModule', () => {
    expect(hasAccess('Manager', 'SettingsModule')).toBe(false);
  });
});

describe('verifyAccess', () => {
  test('User has access to ProfileModule', () => {
    expect(verifyAccess('User', 'ProfileModule')).toBe(true);
  });

  test('User does not have access to UserManagementModule', () => {
    expect(verifyAccess('User', 'UserManagementModule')).toBe(false);
  });

  test('Admin has access to SettingsModule', () => {
    expect(verifyAccess('Admin', 'SettingsModule')).toBe(true);
  });

  test('Manager has access to ReportsModule', () => {
    expect(verifyAccess('Manager', 'ReportsModule')).toBe(true);
  });

  test('Manager does not have access to SettingsModule', () => {
    expect(verifyAccess('Manager', 'SettingsModule')).toBe(false);
  });
});
