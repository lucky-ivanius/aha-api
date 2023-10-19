import { Name } from '../name';

describe('models:user - Name (Value Object)', () => {
  it('should pass for a valid name', () => {
    const name = 'name';

    const result = Name.create(name);

    expect(result.isSuccess).toBeTruthy();
    expect(result.data).toBeInstanceOf(Name);
    expect(result.data.value).toBe(name);
  });

  it('should fail for an empty name value', () => {
    const name = null;

    const result = Name.create(name!);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });

  it('should fail for name that has less than 2 characters', () => {
    const name = 'n';

    const result = Name.create(name);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
