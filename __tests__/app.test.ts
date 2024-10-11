import request from 'supertest';
import httpStatus from 'http-status';
import app from '../index';
import { hasAccess } from '../types/permissions';

jest.mock('../types/permissions');

const mockHasAccess = hasAccess as jest.Mock;

describe('GET /:path', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Should allow access to authorized role for /profile', async () => {
    mockHasAccess.mockReturnValue(true);

    const response = await request(app).get('/profile').set('x-role', 'User');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toContain('Module loaded for /profile');
  });

  test('Should deny access to unauthorized role for /user-management', async () => {
    mockHasAccess.mockReturnValue(false);

    const response = await request(app).get('/user-management').set('x-role', 'User');

    expect(response.status).toBe(httpStatus.FORBIDDEN);
    expect(response.text).toBe('Access denied');
  });

  test('Should allow access to Admin for /settings', async () => {
    mockHasAccess.mockReturnValue(true);

    const response = await request(app).get('/settings').set('x-role', 'Admin');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toContain('Module loaded for /settings');
  });
});
