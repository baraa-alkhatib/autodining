import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { StorageService } from 'ngx-webstorage-service';
import { Observable, ReplaySubject } from 'rxjs';
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
   * @type {ReplaySubject<boolean>}
   * @memberof AuthService
   */
  private _isLoggedIn$!: ReplaySubject<boolean>;

  /**
   * Holds the user access token
   * @private
   * @type {string}
   * @memberof AuthService
   */
  private _accessToken!: string;

  /**
   * Holds the user data model
   * @private
   * @type {User}
   * @memberof AuthService
   */
  private _user!: IUser;

  /**
   * Returns the user access token
   * @readonly
   * @type {string}
   * @memberof AuthService
   */
  public get accessToken(): string {
    return this._accessToken;
  }

  /**
   * Returns the user Info
   * @readonly
   * @memberof AuthService
   */
  public get userInfo() {
    return this._user;
  }

  constructor(
    private _http: HttpClient,

    private _jwtHelper: JwtHelperService,

    @Inject(STORAGE_PROVIDER_TOKEN) private _storage: StorageService
  ) {
    // assign a new ReplaySubject with buffersize 1 to store only the last value
    this._isLoggedIn$ = new ReplaySubject(1);
  }

  public async initAuth(): Promise<void> {
    // retrieve the access token from storage
    const accessToken = await this._storage.get(ACCESS_TOKEN_KEY);

    if (accessToken) {
      // extract user info from storage
      const userInfo = await this._storage.get(USER_INFO_KEY);

      // check if token was expired
      const isExpired = this._jwtHelper.isTokenExpired(accessToken);

      // if token is not expired, retrieve user information
      if (!isExpired) {
        if (userInfo) {
          this._user = JSON.parse(userInfo);
        } else {
          // if user info is not found log out
          this.logout();
        }

        // set access token
        this._accessToken = accessToken;

        // notifiy the app of the auth state
        this._isLoggedIn$.next(true);
      }
    } else {
      // if access token is not found log out
      this.logout();
    }
  }

  /**
   * Returns an observable that is going to emit the last authentication status of the user
   * and the subsequent changes
   * @returns {Observable<boolean>}
   * @memberof AuthService
   */
  public isLoggedIn(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
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
          this._user = {
            _id: res.user._id,
            email: res.user.email,
            name: `${res.user.name}`,
            type: res.user.type,
            imageUrl: res.user.imageUrl,
          };

          // save user info in storage
          this._storage.set(USER_INFO_KEY, JSON.stringify(this._user));

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
