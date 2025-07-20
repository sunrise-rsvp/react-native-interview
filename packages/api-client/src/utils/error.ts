import { RequiredParameterError } from '../constants/RequiredParameterError';

export function assertParameterIsNotEmptyString(
  param: string | undefined,
  name: string,
) {
  if (param === '') {
    throw new RequiredParameterError(`${name} is empty string`);
  }
}

export function assertParameterIsNotUndefinedOrNull<T>(
  param: T | undefined,
  name: string,
): asserts param is T {
  if (param === undefined || param === null) {
    throw new RequiredParameterError(`${name} is undefined or null`);
  }
}
