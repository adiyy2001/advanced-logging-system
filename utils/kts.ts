export type AsyncFunctionType<Input, Output> = {
  run: (_input: Input) => Promise<Output>;
};

export function createAsyncFunction<Input, Output>(
  fn: (_input: Input) => Promise<Output>,
): AsyncFunctionType<Input, Output> {
  return { run: fn };
}
