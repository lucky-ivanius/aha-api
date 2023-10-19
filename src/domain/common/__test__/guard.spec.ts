import { Guard, NumberGuardArg, RequiredGuardArg } from '../guard';

describe('domain:common - Guard', () => {
  const name = 'Arg';

  describe('required', () => {
    it('should pass for valid string', () => {
      const requiredArg: RequiredGuardArg<string> = {
        name,
        value: 'string',
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(requiredArg.value);
    });

    it('should pass for valid number or zero value', () => {
      const requiredArg: RequiredGuardArg<number> = {
        name,
        value: 0,
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(requiredArg.value);
    });

    it('should pass for valid boolean or false value', () => {
      const requiredArg: RequiredGuardArg<boolean> = {
        name,
        value: false,
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(requiredArg.value);
    });

    it('should pass for valid object', () => {
      const requiredArg: RequiredGuardArg<unknown> = {
        name,
        value: {
          key1: 'value',
        },
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(requiredArg.value);
    });

    it('should fail for empty string', () => {
      const requiredArg: RequiredGuardArg<string> = {
        name,
        value: '',
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBeDefined();
    });

    it('should fail for empty value', () => {
      const requiredArg: RequiredGuardArg<null> = {
        name,
        value: null,
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBeDefined();
    });

    it('should fail for empty object', () => {
      const requiredArg: RequiredGuardArg<object> = {
        name,
        value: {},
      };

      const result = Guard.required(requiredArg);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBeDefined();
    });
  });

  describe('number', () => {
    const value = 10;

    it('should pass for equal operator compare to same value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'eq',
        compareTo: value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for not equal operator compare to different value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'ne',
        compareTo: value + value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for greater than or equal operator compare to greater than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'gte',
        compareTo: value - 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for greater than or equal operator compare to the same value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'gte',
        compareTo: value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for less than or equal operator compare to less than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'lte',
        compareTo: value + 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for less than or equal operator compare to the same value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'lte',
        compareTo: value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for greater than operator compare to greater than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'gt',
        compareTo: value - 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    it('should pass for less than operator compare to less than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'lt',
        compareTo: value + 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toEqual(numberArg.value);
    });

    // fail
    it('should fail for equal operator compare to different value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'eq',
        compareTo: value + value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });

    it('should fail for not equal operator compare to same value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'ne',
        compareTo: value,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });

    it('should fail for greater than or equal operator compare to less than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'gte',
        compareTo: value + 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });

    it('should fail for less than or equal operator compare to less than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'lte',
        compareTo: value - 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });

    it('should fail for greater than operator compare to less than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'gt',
        compareTo: value + 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });

    it('should fail for less than operator compare to greater than value', () => {
      const numberArg: NumberGuardArg = {
        name,
        value,
        operator: 'lt',
        compareTo: value - 1,
      };

      const result = Guard.number(numberArg);

      expect(result.isSuccess).toBeFalsy();
    });
  });
});
