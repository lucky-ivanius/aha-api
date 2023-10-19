import { v4 as uuid } from 'uuid';

export class Id {
  private readonly value: string;

  constructor(value?: string) {
    this.value = value ?? uuid();
  }

  public toString(): string {
    return this.value;
  }
}
