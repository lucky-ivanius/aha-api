export class Result<T> {
  get error(): string {
    return this._errorMessage as string;
  }

  get data(): T {
    return this._data as T;
  }

  protected constructor(
    public readonly isSuccess: boolean,
    private readonly _errorMessage?: string,
    private readonly _data?: T
  ) {
    Object.freeze(this);
  }

  public static ok<T>(data?: T): Result<T> {
    return new Result(true, undefined, data);
  }

  public static fail<T>(errorMessage: string, err?: T): Result<T> {
    return new Result(false, errorMessage, err);
  }

  public static combine(...results: Result<unknown>[]): Result<unknown> {
    for (const result of results) {
      if (!result.isSuccess) return Result.fail(result.error);
    }

    return Result.ok();
  }
}
