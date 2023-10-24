import { AnyZodObject, ZodEffects, z } from 'zod';
import { Result } from '../../../domain/common/result';

export class Validation<
  SchemaType extends AnyZodObject | ZodEffects<AnyZodObject>,
> {
  constructor(private readonly schema: SchemaType) {}

  public validate(data: unknown): Result<z.infer<SchemaType>> {
    const result = this.schema.safeParse(data);

    if (!result.success) return Result.fail(result.error.issues[0].message);

    return Result.ok(result.data);
  }
}
