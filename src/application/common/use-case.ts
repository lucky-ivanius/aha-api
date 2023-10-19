export interface UseCase<In, Out> {
  execute(data: In): Out | Promise<Out>;
}

export type UseCaseError =
  | {
      [key: string]: unknown;
    }
  | unknown;
