import { Continuation } from './cps';
import { createAsyncFunction } from './kts';

export async function generateManagerReport<T>(data: T[], continuation: Continuation<string>): Promise<void> {
  const result = await new Promise<string>((resolve) =>
    setTimeout(() => resolve(`Report generated with ${data.length} items`), 1000),
  );
  continuation(result);
}

export const asyncReportFunction = createAsyncFunction(
  async <T>(data: T[]): Promise<string> =>
    new Promise<string>((resolve) => setTimeout(() => resolve(`Report generated for ${data.length} items`), 1000)),
);
