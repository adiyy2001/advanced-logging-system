export type Continuation<T> = (_result: T) => void;

export async function asyncCPS<T>(operation: () => Promise<T>, continuation: Continuation<T>): Promise<void> {
  const result = await operation();
  continuation(result);
}
