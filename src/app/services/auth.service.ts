import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ACCESS_TOKEN_KEY, API, USER_INFO_KEY } from '../../environments/environment';
import { IUser } from '../models/user.model';
import { STORAGE_PROVIDER_TOKEN } from '../providers/sotrage-token.provider';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * - Holds the most recent authentication status of the user.
   * - Emits the most recent authentication status to a new subscriber.
   * - Emits the authentication status to the subscribers whenever it changes.
   * @private
   * @type {BehaviorSubject<boolean>}
   * @memberof AuthService
   */
  private readonly _isLoggedIn$!: BehaviorSubject<boolean>;

  /**
   * - Holds the most recent user data.
   * - Emits the most recent user data to a new subscriber.
   * - Emits user data to the subscribers whenever it changes.
   * @private
   * @type {BehaviorSubject<IUser>}
   * @memberof AuthService
   */
  private readonly _user$!: BehaviorSubject<IUser>;

  /**
   * Holds the user access token
   * @private
   * @type {string}
   * @memberof AuthService
   */
  private _accessToken!: string;

  /**
   * Returns an observable that is going to emit the last authentication status of the user
   * and the subsequent changes
   * @returns {Observable<boolean>}
   * @memberof AuthService
   */
  public get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  /**
   * Returns the current authentication status
   * @readonly
   * @type {boolean}
   * @memberof AuthService
   */
  public get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  /**
   * Returns an observable that is going to emit the last user data
   * and the subsequent changes
   * @readonly
   * @type {Observable<IUser>}
   * @memberof AuthService
   */
  public get user$(): Observable<IUser> {
    return this._user$.asObservable();
  }

  /**
   * Returns the current user data
   * @readonly
   * @type {IUser}
   * @memberof AuthService
   */
  public get user(): IUser {
    return this._user$.value;
  }

  /**
   * Returns the user access token
   * @readonly
   * @type {string}
   * @memberof AuthService
   */
  public get accessToken(): string {
    return this._accessToken;
  }

  constructor(
    private _http: HttpClient,

    private _jwtHelper: JwtHelperService,

    @Inject(STORAGE_PROVIDER_TOKEN) private _storage: StorageService
  ) {
    // assign a new BehaviorSubject
    this._isLoggedIn$ = new BehaviorSubject(<boolean>false);

    // assign a new BehaviorSubject
    this._user$ = new BehaviorSubject(<IUser>(<unknown>null));
  }

  public async initAuth(): Promise<void> {
    // retrieve the access token from storage
    const accessToken = await this._storage.get(ACCESS_TOKEN_KEY);

    if (accessToken) {
      // extract user info from storage
      const user = await this._storage.get(USER_INFO_KEY);

      // check if token was expired
      const isExpired = this._jwtHelper.isTokenExpired(accessToken);

      // if token is not expired, retrieve user information
      if (!isExpired) {
        if (user) {
          this._user$.next(JSON.parse(user));
        } else {
          // if user info is not found log out
          this.logout();
        }

        // set access token
        this._accessToken = accessToken;

        // emit auth state
        this._isLoggedIn$.next(true);
      }
    } else {
      // if access token is not found log out
      this.logout();
    }
  }

  /**
   * Updates subscribers to _user$ BehaviourSubject with the most recent version of user data
   * @param {Partial<IUser>} data
   * @memberof AuthService
   */
  public patchUser(data: Partial<IUser>): void {
    // get old user from user behaviour subject
    const oldUser: IUser = this._user$.value;

    // compose new user object with the new values
    const newUser = {
      _id: data._id || oldUser._id,
      name: data.name || oldUser.name,
      email: data.email || oldUser.email,
      type: data.type || oldUser.type,
      imageUrl: data.imageUrl || oldUser.imageUrl,
    };

    // emit new user
    this._user$.next(newUser);

    // update the user in storage
    this._storage.set(USER_INFO_KEY, JSON.stringify(this._user$.getValue()));
  }

  /**
   * Authenticate the user with the necessary credentials
   * @param {NgForm} credentialsForm
   * @returns {Observable<{ user: User; token: string }>}
   * @memberof AuthService
   */
  public login(credentialsForm: NgForm): Observable<{ user: IUser; token: string }> {
    // return http post observable
    return this._http.post<{ user: IUser; token: string }>(API.login, credentialsForm).pipe(
      tap((res: { user: IUser; token: string }) => {
        if (res) {
          // set the jwt token
          this._storage.set(ACCESS_TOKEN_KEY, res.token);
          this._accessToken = res.token;

          // set user info
          const user = {
            _id: res.user._id,
            email: res.user.email,
            name: `${res.user.name}`,
            type: res.user.type,
            imageUrl: res.user.imageUrl,
          };

          // emit user
          this._user$.next(user);

          // save user info in storage
          this._storage.set(USER_INFO_KEY, JSON.stringify(this._user$.getValue()));

          // notifiy the app of the auth state
          this._isLoggedIn$.next(true);
        }
      })
    );
  }

  /**
   * Register a new user with the necessary credentials
   * @param {NgForm} credentialsForm
   * @returns {Observable<{ user: User; token: string }>}
   * @memberof AuthService
   */
  public signup(credentialsForm: NgForm): Observable<any> {
    // return http post observable
    return this._http.post(API.signup, credentialsForm);
  }

  public async logout(): Promise<void> {
    // tell subscribers that the user has logged out
    this._isLoggedIn$.next(false);

    // remove access token
    this._accessToken = '';

    // remove JWT Token
    await this._storage.remove(ACCESS_TOKEN_KEY);

    // remove user info
    await this._storage.remove(USER_INFO_KEY);
  }
}
