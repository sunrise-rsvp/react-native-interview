import { RequiredParameterError } from '../constants/RequiredParameterError';


export function assertParameterIsNotUndefinedOrNull<T>(
  param: T | undefined,
  name: string,
): asserts param is T {
  if (param === undefined || param === null) {
    throw new RequiredParameterError(`${name} is undefined or null`);
  }
}
