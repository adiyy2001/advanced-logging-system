import logger from '../core/logger';

/**
 * A continuation function that takes a result of type `T` and returns `void`.
 *
 * @typedef {function(T): void} Continuation
 * @template T
 *
 * @param {T} _result - The result to be processed by the continuation function.
 */
export type Continuation<T> = (_result: T) => void;

/**
 * A continuation function for parallel operations that takes an array of results of type `T` and returns `void`.
 *
 * @typedef {function(T[]): void} ParallelContinuation
 * @template T
 *
 * @param {T[]} _results - An array of results to be processed by the continuation function.
 */
export type ParallelContinuation<T> = (_results: T[]) => void;

/**
 * Executes multiple asynchronous tasks in parallel and passes their results to a continuation function.
 *
 * @function asyncParallelCPS
 *
 * @template T
 *
 * @param {Array<function(): Promise<T>>} tasks - An array of asynchronous tasks to execute in parallel.
 * @param {ParallelContinuation<T>} continuation - The continuation function to handle the array of results.
 *
 * @returns {Promise<void>} A promise that resolves when all tasks and the continuation are complete.
 *
 * @throws {Error} If any task throws an error, logs it using `logger` and rethrows the error.
 */
export async function asyncParallelCPS<T>(
  tasks: Array<() => Promise<T>>,
  continuation: ParallelContinuation<T>,
): Promise<void> {
  try {
    const results = await Promise.all(tasks.map((task) => task()));
    continuation(results);
  } catch (error) {
    logger.roleLogger.Admin('An error occurred:', 'Error');
    throw error;
  }
}
