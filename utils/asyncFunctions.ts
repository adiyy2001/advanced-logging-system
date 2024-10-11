import logger from '../core/logger';

export type UserProfile = { name: string; age: number };

export type ManagerReport = { reportId: string; data: unknown[] };

export type BackupStatus = { status: string; progress: number };

const data = {
  user: { name: 'Alice', age: 30 } as UserProfile,
  report: [{ reportId: '1', data: [1, 2, 3] }] as ManagerReport[],
  backup: { status: 'in progress', progress: 50 } as BackupStatus,
};

type FetchDataType<T> = T extends 'user'
  ? UserProfile
  : T extends 'report'
    ? ManagerReport[]
    : T extends 'backup'
      ? BackupStatus
      : never;

export async function fetchDataAdvanced<T extends keyof typeof data>(url: T): Promise<FetchDataType<T>> {
  logger.roleLogger.Admin(`Fetching data for ${url}`, 'Info');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url) {
        const result = data[url];
        logger.roleLogger.Manager(`Successfully fetched data for ${url}`, 'Info');
        resolve(result as FetchDataType<T>);
      } else {
        logger.roleLogger.User(`Failed to fetch data for ${url}`, 'Warning');
        reject(new Error('URL is required'));
      }
    }, 500);
  });
}

export async function composeAsync<Output>(
  input: Output,
  ...fns: Array<(_arg: Output) => Promise<Output>>
): Promise<Output> {
  return fns.reduce<Promise<Output>>(async (prevPromise, fn) => {
    try {
      const result = await prevPromise;
      const newResult = await fn(result);
      logger.roleLogger.Manager('Function executed successfully', 'Info');
      return newResult;
    } catch (error) {
      logger.roleLogger.Admin(`Error executing function: ${(error as Error).message}`, 'Error');
      throw error;
    }
  }, Promise.resolve(input));
}
