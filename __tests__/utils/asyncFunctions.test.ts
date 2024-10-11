import { fetchDataAdvanced } from '../../utils/asyncFunctions';

describe('fetchDataAdvanced with adaptive typing', () => {
  test('fetches user data with correct typing', async () => {
    const userProfile = await fetchDataAdvanced('user');
    expect(userProfile).toEqual({ name: 'Alice', age: 30 });
  });

  test('fetches report data with correct typing', async () => {
    const reports = await fetchDataAdvanced('report');
    expect(reports).toEqual([{ reportId: '1', data: [1, 2, 3] }]);
  });

  test('fetches backup data with correct typing', async () => {
    const backupStatus = await fetchDataAdvanced('backup');
    expect(backupStatus).toEqual({ status: 'in progress', progress: 50 });
  });

  test('throws error on missing URL', async () => {
    await expect(fetchDataAdvanced('' as never)).rejects.toThrow('URL is required');
  });
});
