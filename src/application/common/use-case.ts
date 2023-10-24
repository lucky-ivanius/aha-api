export interface UseCase<In, Out> {
  execute(data: In): Out | Promise<Out>;
}
