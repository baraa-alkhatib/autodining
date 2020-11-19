/**
 * @export
 * @interface ICustomError
 */
export default interface ICustomError {
  client?: any;
  server?: any;
  statusCode?: number;
  redirectTo?: string;
}
