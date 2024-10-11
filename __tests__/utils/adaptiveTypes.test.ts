import fetchDataAdaptive from '../../utils/adaptiveTypes';

describe('fetchDataAdaptive', () => {
  test('fetches user data with correct typing', async () => {
    const result = await fetchDataAdaptive('user');
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  test('fetches report data with correct typing', async () => {
    const result = await fetchDataAdaptive('report');
    expect(result).toEqual([{ reportId: 'R1', data: [1, 2, 3] }]);
  });

  test('fetches backup data with correct typing', async () => {
    const result = await fetchDataAdaptive('backup');
    expect(result).toEqual({ status: 'completed', progress: 100 });
  });

  test('throws error on unknown data type', async () => {
    await expect(fetchDataAdaptive('unknown' as never)).rejects.toThrow('Unknown data type');
  });
});
