// src/utils/__tests__/parallelCps.test.ts
import { asyncParallelCPS } from '../asyncParallelCps';
import fetchDataAdaptive from '../adaptiveTypes';
import { UserProfile, ManagerReport, BackupStatus } from '../asyncFunctions';

describe('asyncParallelCPS', () => {
  test('handles user data flow with correct typing', async () => {
    const continuation = jest.fn((result) => {
      expect(result).toEqual([{ name: 'Alice', age: 30 }]);
    });

    await asyncParallelCPS([() => fetchDataAdaptive('user')], continuation);
    expect(continuation).toHaveBeenCalled();
  });

  test('throws error if one of the tasks fails', async () => {
    const failingTask = jest.fn(() => Promise.reject(new Error('Failed task')));
    const successfulTask = jest.fn(() => Promise.resolve({ name: 'Alice', age: 30 }));

    const continuation = jest.fn();

    await expect(asyncParallelCPS([successfulTask, failingTask], continuation))
      .rejects.toThrow('Failed task'); // Oczekiwanie rzucenia błędu
  });

  test('handles report aggregation for manager', async () => {
    const continuation = jest.fn((result) => {
      expect(result).toEqual([[{ reportId: 'R1', data: [1, 2, 3] }]]);
    });

    await asyncParallelCPS([() => fetchDataAdaptive('report')], continuation);
    expect(continuation).toHaveBeenCalled();
  });

  test('admin backup flow with status monitoring', async () => {
    const backupTask = jest.fn().mockResolvedValue({ status: 'completed', progress: 100 });
    const continuation = jest.fn((result) => {
      expect(result).toEqual([{ status: 'completed', progress: 100 }]);
    });

    await asyncParallelCPS([backupTask], continuation);
    expect(continuation).toHaveBeenCalled();
  });

  test('handles parallel operations with data integrity', async () => {
    type TaskResult = UserProfile | ManagerReport[] | BackupStatus;
    const tasks: (() => Promise<TaskResult>)[] = [
      () => fetchDataAdaptive('user') as Promise<TaskResult>,
      () => fetchDataAdaptive('report') as Promise<TaskResult>,
      () => fetchDataAdaptive('backup') as Promise<TaskResult>,
    ];

    const continuation = jest.fn((results: TaskResult[]) => {
      expect(results).toHaveLength(3);
      expect(results[0]).toMatchObject({ name: 'Alice', age: 30 });
      expect(results[1]).toMatchObject([{ reportId: 'R1', data: [1, 2, 3] }]);
      expect(results[2]).toMatchObject({ status: 'completed', progress: 100 });
    });

    await asyncParallelCPS(tasks, continuation);
    expect(continuation).toHaveBeenCalled();
  });
});
