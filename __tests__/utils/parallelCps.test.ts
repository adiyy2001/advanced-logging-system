import { asyncParallelCPS } from '../asyncParallelCps';

describe('asyncParallelCPS', () => {
  test('executes parallel tasks and returns all results', async () => {
    const mockOperation1 = jest.fn().mockResolvedValue('Result 1');
    const mockOperation2 = jest.fn().mockResolvedValue('Result 2');
    const mockOperation3 = jest.fn().mockResolvedValue('Result 3');

    const continuation = jest.fn();

    await asyncParallelCPS([mockOperation1, mockOperation2, mockOperation3], continuation);

    expect(mockOperation1).toHaveBeenCalledTimes(1);
    expect(mockOperation2).toHaveBeenCalledTimes(1);
    expect(mockOperation3).toHaveBeenCalledTimes(1);
    expect(continuation).toHaveBeenCalledWith(['Result 1', 'Result 2', 'Result 3']);
  });

  test('handles empty list of tasks gracefully', async () => {
    const continuation = jest.fn();
    await asyncParallelCPS([], continuation);
    expect(continuation).toHaveBeenCalledWith([]);
  });

  test('throws error if one of the tasks fails', async () => {
    const mockOperation1 = jest.fn().mockResolvedValue('Result 1');
    const mockOperation2 = jest.fn().mockRejectedValue(new Error('Failed task'));

    const continuation = jest.fn();

    await expect(asyncParallelCPS([mockOperation1, mockOperation2], continuation))
      .rejects.toThrow('Failed task');
  });
});
