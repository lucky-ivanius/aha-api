import { Id } from './id';

export type Model<Props> = {
  readonly id: Id;
} & Props;
