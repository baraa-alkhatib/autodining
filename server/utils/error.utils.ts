import ICustomError from '../models/custom-error.model';

/**
 * - Creates an error of @type {ICustomError}
 * - This function is helpful when you want to enforce a behaviour @example 'redirectTo' without changing
 * the original error value, this will make it easy to extend error objects/values
 * @export
 * @param {*} originalError
 * @param {ICustomError} [error] - Override/Enforce some or all ICustomError fields
 * @returns {ICustomError}
 */
export default function createError(originalError: any, error?: ICustomError): ICustomError {
  return {
    client: error?.client || originalError?.client || null,
    server: error?.server || originalError?.server || originalError,
    statusCode: error?.statusCode || originalError?.statusCode || 500,
    redirectTo: error?.redirectTo || originalError?.redirectTo || null,
  };
}
