import validator from 'validator';

export class Validator {
  public static readonly USER_REAL_NAME_PATTERN = /^[a-zA-Z ]+$/;

  public static readonly STRONG_PASSWORD_PATTERN = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;

  /**
   * Determines if an email is a valid email, returning true or false as appropriate.
   * @static
   * @param {string} email
   * @returns {boolean}
   * @memberof Validator
   */
  static isEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  /**
   * Determines if a user name is acceptable, returning true or false as appropriate.
   * @static
   * @memberof Validator
   */
  static isValidUserName(name: string): boolean {
    return this.USER_REAL_NAME_PATTERN.test(name);
  }

  /**
   * Determines if a password is valid and strong, returning true or false as appropriate.
   * @static
   * @memberof Validator
   */
  static isStrongPassword(password: string): boolean {
    return this.STRONG_PASSWORD_PATTERN.test(password);
  }
}
